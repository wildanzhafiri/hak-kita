import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { tool } from 'ai';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isOfficialDomain, programPath, rankPrograms } from '@hakkita/domain';
import {
  AssistantBudgetQuerySchema,
  AssistantCatalogQuerySchema,
  AssistantNewsQuerySchema,
  AssistantPageReadQuerySchema,
  AssistantPageQuerySchema,
  AssistantPlanQuerySchema,
  AssistantSaveProgramQuerySchema,
} from '@hakkita/schema';
import type { Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { loadApbdBudgetSnapshot } from './budget';
import {
  ASSISTANT_PAGE_LINKS,
  OFFICIAL_EXTRACT_URL,
  OFFICIAL_PAGE_TEXT_LIMIT,
  OFFICIAL_SEARCH_RESULT_LIMIT,
  OFFICIAL_SEARCH_URL,
  OFFICIAL_SNIPPET_LIMIT,
  OFFICIAL_WEB_TIMEOUT_MS,
} from './constants';
import { loadPrograms, loadPublishedInformation } from './data';
import { findProgramKnowledge } from './program-knowledge';

const MAX_CATALOG_RESULTS = 5;
const NEWS_RESULT_LIMIT = 5;

function findCatalogMatches(programs: readonly Program[], query: string) {
  return rankPrograms(programs, query, MAX_CATALOG_RESULTS).map((program) => ({
    id: program.id,
    href: programPath(program),
    name: program.nama,
    category: program.kategori,
    summary: program.ringkasan,
    scope: program.cakupan.level === 'nasional' ? 'Nasional' : program.cakupan.kode,
    verification: program.verifikasi,
    checkedOn: program.tanggalDiperiksa ?? null,
    sourceUrl: program.sumberUtama.url,
  }));
}

function isOfficialHttpsUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('https://') && isOfficialDomain(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function callOfficialWeb(
  url: string,
  body: Record<string, unknown>,
  abortSignal: AbortSignal | undefined,
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.any([
        AbortSignal.timeout(OFFICIAL_WEB_TIMEOUT_MS),
        ...(abortSignal ? [abortSignal] : []),
      ]),
    });
    if (!response.ok) return null;
    const parsed: unknown = await response.json();
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function createNewsDatabaseClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function createAssistantTools(
  accountClient: SupabaseClient<Database> | null,
  userId: string | null,
) {
  return {
    findPage: tool({
      description: 'Berikan tautan halaman utama HAKKITA agar pengguna dapat berpindah halaman.',
      inputSchema: AssistantPageQuerySchema,
      execute: async ({ page }) => ASSISTANT_PAGE_LINKS[page],
    }),
    getProgramDetails: tool({
      description:
        'Ambil syarat, langkah, periode, dan daftar berkas dari satu halaman program atau layanan HAKKITA.',
      inputSchema: AssistantSaveProgramQuerySchema,
      execute: async ({ programId }) => {
        const program = (await loadPublishedInformation()).find((entry) => entry.id === programId);
        if (!program) return { available: false };
        return {
          available: true,
          id: program.id,
          name: program.nama,
          href: programPath(program),
          summary: program.ringkasan,
          requirements: program.syarat.map((requirement) => ({
            text: requirement.teks,
            sourceUrl: requirement.sumberUrl ?? null,
          })),
          steps: program.langkah,
          cost: program.biaya ?? null,
          channels: program.kanal ?? [],
          about: program.tentang ?? null,
          documents:
            program.berkas?.dokumen.map((document) => ({
              label: document.label,
              conditional: Boolean(document.kondisi),
              condition: document.kondisi ?? null,
              sourceUrl: document.sumberUrl,
            })) ??
            program.dokumen.map((label) => ({
              label,
              conditional: false,
              condition: null,
              sourceUrl: null,
            })),
          period: program.periode ?? null,
          note: program.catatan ?? null,
          verification: program.verifikasi,
          checkedOn: program.tanggalDiperiksa ?? null,
          sourceUrl: program.sumberUtama.url,
        };
      },
    }),
    searchCatalog: tool({
      description: 'Cari program bantuan atau layanan publik dari katalog HAKKITA.',
      inputSchema: AssistantCatalogQuerySchema,
      execute: async ({ query }) => {
        const programs = await loadPublishedInformation();
        return { results: findCatalogMatches(programs, query) };
      },
    }),
    searchKnowledge: tool({
      description: 'Cari panduan, syarat, berkas, dan kendala dari bahan resmi terkurasi.',
      inputSchema: AssistantCatalogQuerySchema,
      execute: async ({ query }) => {
        const passages = await findProgramKnowledge(query, { limit: MAX_CATALOG_RESULTS });
        return {
          results: passages.map((passage) => ({
            program: passage.programName,
            section: passage.section,
            title: passage.title,
            text: passage.text,
            sourceUrl: passage.sourceUrl,
            checkedOn: passage.checkedOn,
            verification: passage.verification,
          })),
        };
      },
    }),
    searchOfficialWeb: tool({
      description:
        'Cari di situs resmi pemerintah (.go.id dan .desa.id) untuk pertanyaan layanan publik, program, atau aturan yang tidak ada di katalog HAKKITA. Hasilnya belum diperiksa HAKKITA.',
      inputSchema: AssistantCatalogQuerySchema,
      execute: async ({ query }, { abortSignal }) => {
        const data = await callOfficialWeb(
          OFFICIAL_SEARCH_URL,
          {
            query,
            search_depth: 'advanced',
            max_results: OFFICIAL_SEARCH_RESULT_LIMIT,
            include_domains: ['go.id', 'desa.id'],
            include_domains_mode: 'restrict',
            country: 'indonesia',
            language: 'id',
          },
          abortSignal,
        );
        if (!data || !Array.isArray(data.results)) return { available: false, results: [] };
        return {
          available: true,
          verifiedByHakkita: false,
          results: data.results.flatMap((result: unknown) => {
            if (!isRecord(result) || !isOfficialHttpsUrl(result.url)) return [];
            return [
              {
                title: typeof result.title === 'string' ? result.title : 'Sumber resmi',
                sourceUrl: result.url,
                snippet:
                  typeof result.content === 'string'
                    ? result.content.slice(0, OFFICIAL_SNIPPET_LIMIT)
                    : '',
              },
            ];
          }),
        };
      },
    }),
    readOfficialPage: tool({
      description:
        'Baca isi satu halaman situs resmi pemerintah (.go.id atau .desa.id), biasanya dari hasil searchOfficialWeb, untuk mengambil langkah, syarat, atau biaya yang tertulis di sana.',
      inputSchema: AssistantPageReadQuerySchema,
      execute: async ({ url }, { abortSignal }) => {
        if (!isOfficialHttpsUrl(url))
          return { available: false, reason: 'Hanya situs resmi .go.id atau .desa.id.' };
        const data = await callOfficialWeb(
          OFFICIAL_EXTRACT_URL,
          { urls: [url], extract_depth: 'advanced', format: 'markdown', include_images: false },
          abortSignal,
        );
        const first = data && Array.isArray(data.results) ? data.results[0] : null;
        if (
          !isRecord(first) ||
          typeof first.raw_content !== 'string' ||
          !isOfficialHttpsUrl(first.url)
        ) {
          return { available: false, reason: 'Halaman tidak dapat dibaca.' };
        }
        return {
          available: true,
          verifiedByHakkita: false,
          title: typeof first.title === 'string' ? first.title : 'Sumber resmi',
          sourceUrl: first.url,
          text: first.raw_content.slice(0, OFFICIAL_PAGE_TEXT_LIMIT),
        };
      },
    }),
    getOfficialUpdates: tool({
      description: 'Cari kabar program yang sudah dikurasi dari sumber resmi.',
      inputSchema: AssistantNewsQuerySchema,
      execute: async ({ programId }) => {
        const client = createNewsDatabaseClient();
        if (!client) return { available: false, results: [] };

        let query = client
          .from('program_news')
          .select('id,program_id,title,summary,source_url,published_on,created_at')
          .order('published_on', { ascending: false })
          .limit(NEWS_RESULT_LIMIT);
        if (programId) query = query.eq('program_id', programId);

        const { data, error } = await query;
        if (error) return { available: false, results: [] };

        return {
          available: true,
          results: data
            .filter(
              (news) => news.source_url.startsWith('https://') && isOfficialDomain(news.source_url),
            )
            .map((news) => ({
              title: news.title,
              summary: news.summary,
              publishedOn: news.published_on,
              sourceUrl: news.source_url,
              programId: news.program_id,
            })),
        };
      },
    }),
    getBudgetData: tool({
      description: 'Ambil snapshot alokasi dan realisasi APBD nasional dari Portal Data SIKD.',
      inputSchema: AssistantBudgetQuerySchema,
      execute: async ({ year }) => {
        try {
          const snapshot = await loadApbdBudgetSnapshot(year);
          return {
            scope: 'Nasional',
            ...snapshot,
            sourceUrl: 'https://djpk.kemenkeu.go.id/portal/data/apbd',
          };
        } catch {
          return { available: false, sourceUrl: 'https://djpk.kemenkeu.go.id/portal/data/apbd' };
        }
      },
    }),
    getMyPlan: tool({
      description:
        'Lihat program dan layanan yang tersimpan di Rencanaku milik pengguna yang masuk.',
      inputSchema: AssistantPlanQuerySchema,
      execute: async () => {
        if (!userId) return { requiresLogin: true, programs: [] };
        if (!accountClient) return { available: false, programs: [] };

        const { data: savedPrograms, error: savedError } = await accountClient
          .from('saved_programs')
          .select('program_id')
          .eq('user_id', userId);
        if (savedError) return { available: false, programs: [] };

        const programs = await loadPublishedInformation();
        const savedIds = new Set(savedPrograms.map((entry) => entry.program_id));
        return {
          available: true,
          programs: programs
            .filter((program) => savedIds.has(program.id))
            .map((program) => ({ name: program.nama, isSaved: true })),
        };
      },
    }),
    saveProgramToPlan: tool({
      description: 'Simpan program ke Rencanaku setelah pengguna mengonfirmasi tindakan ini.',
      inputSchema: AssistantSaveProgramQuerySchema,
      execute: async ({ programId }) => {
        if (!userId) return { saved: false, requiresLogin: true };
        if (!accountClient) return { saved: false, reason: 'Akun belum dapat diakses.' };

        const programs = await loadPrograms();
        const program = programs.find((entry) => entry.id === programId);
        if (!program) return { saved: false, reason: 'Program tidak ditemukan.' };

        const { error } = await accountClient
          .from('saved_programs')
          .upsert(
            { user_id: userId, program_id: programId },
            { onConflict: 'user_id,program_id', ignoreDuplicates: true },
          );
        if (error) return { saved: false, reason: 'Program belum dapat disimpan. Coba lagi.' };

        return { saved: true, programId, programName: program.nama };
      },
    }),
  };
}

export async function getAssistantPageContext(currentPath: string | undefined): Promise<string> {
  if (!currentPath || currentPath === '/') return 'Pengguna sedang melihat Beranda.';

  const segments = currentPath.split('/').filter(Boolean);
  const section = segments[0];
  const id = segments[1];
  if (
    id &&
    (section === 'program' ||
      section === 'layanan' ||
      section === 'kenali-hakmu' ||
      section === 'urus-kebutuhanmu')
  ) {
    const program = (await loadPublishedInformation()).find((entry) => entry.id === id);
    if (program) {
      return `Pengguna sedang melihat halaman rincian ${program.nama}. ID program: ${program.id}. Ringkasan: ${program.ringkasan}. Sumber utama: ${program.sumberUtama.url}. Gunakan tools untuk menjawab rincian yang belum ada di konteks ini.`;
    }
  }

  const pageNames: Record<string, string> = {
    program: 'Kenali Hakmu',
    'kenali-hakmu': 'Kenali Hakmu',
    layanan: 'Layanan Publik',
    'urus-kebutuhanmu': 'Layanan Publik',
    anggaran: 'Telusuri Anggaran',
    'awasi-uang-publik': 'Telusuri Anggaran',
    rencanaku: 'Rencanaku',
    bantuan: 'Pusat Bantuan',
  };
  return `Pengguna sedang melihat halaman ${pageNames[section ?? ''] ?? 'HAKKITA'}. Gunakan tools bila pertanyaan membutuhkan data spesifik.`;
}
