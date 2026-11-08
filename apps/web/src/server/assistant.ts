import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { tool } from 'ai';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isOfficialDomain, programPath } from '@hakkita/domain';
import {
  AssistantBudgetQuerySchema,
  AssistantCatalogQuerySchema,
  AssistantNewsQuerySchema,
  AssistantPageQuerySchema,
  AssistantPlanQuerySchema,
  AssistantSaveProgramQuerySchema,
} from '@hakkita/schema';
import type { Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { loadApbdBudgetSnapshot } from './budget';
import { ASSISTANT_PAGE_LINKS } from './constants';
import { loadPrograms } from './data';
import { findProgramKnowledge } from './program-knowledge';

const MAX_CATALOG_RESULTS = 5;
const NEWS_RESULT_LIMIT = 5;

function scoreProgram(program: Program, terms: readonly string[]): number {
  const name = program.nama.toLocaleLowerCase('id-ID');
  const category = program.kategori.toLocaleLowerCase('id-ID');
  const text = [program.ringkasan, ...program.untuk].join(' ').toLocaleLowerCase('id-ID');
  return terms.reduce(
    (score, term) =>
      score +
      (name.includes(term) ? 5 : 0) +
      (category.includes(term) ? 3 : 0) +
      (text.includes(term) ? 1 : 0),
    0,
  );
}

function findCatalogMatches(programs: readonly Program[], query: string) {
  const terms = query
    .toLocaleLowerCase('id-ID')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 1);

  if (terms.length === 0) return [];

  return programs
    .map((program) => ({ program, score: scoreProgram(program, terms) }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.program.nama.localeCompare(right.program.nama, 'id-ID'),
    )
    .slice(0, MAX_CATALOG_RESULTS)
    .map(({ program }) => ({
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
        const program = (await loadPrograms()).find((entry) => entry.id === programId);
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
        const programs = await loadPrograms();
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
        'Lihat program tersimpan dan jumlah berkas yang sudah dicentang milik pengguna yang masuk.',
      inputSchema: AssistantPlanQuerySchema,
      execute: async () => {
        if (!userId) return { requiresLogin: true, programs: [] };
        if (!accountClient) return { available: false, programs: [] };

        const [
          { data: savedPrograms, error: savedError },
          { data: progress, error: progressError },
        ] = await Promise.all([
          accountClient.from('saved_programs').select('program_id').eq('user_id', userId),
          accountClient
            .from('berkas_progress')
            .select('program_id,checked_item_ids,updated_at')
            .eq('user_id', userId),
        ]);
        if (savedError || progressError) return { available: false, programs: [] };

        const programs = await loadPrograms();
        const savedIds = new Set(savedPrograms.map((entry) => entry.program_id));
        const progressByProgram = new Map(progress.map((entry) => [entry.program_id, entry]));
        return {
          available: true,
          programs: programs
            .filter((program) => savedIds.has(program.id) || progressByProgram.has(program.id))
            .map((program) => {
              const currentProgress = progressByProgram.get(program.id);
              return {
                name: program.nama,
                isSaved: savedIds.has(program.id),
                checkedDocumentCount: currentProgress?.checked_item_ids.length ?? 0,
                progressUpdatedAt: currentProgress?.updated_at ?? null,
              };
            }),
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
    const program = (await loadPrograms()).find((entry) => entry.id === id);
    if (program) {
      const pageKind = segments.includes('berkas') ? 'halaman berkas' : 'halaman rincian';
      return `Pengguna sedang melihat ${pageKind} ${program.nama}. ID program: ${program.id}. Ringkasan: ${program.ringkasan}. Sumber utama: ${program.sumberUtama.url}. Gunakan tools untuk menjawab rincian yang belum ada di konteks ini.`;
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
    'periksa-kondisimu': 'Periksa Kondisimu',
    bantuan: 'Pusat Bantuan',
  };
  return `Pengguna sedang melihat halaman ${pageNames[section ?? ''] ?? 'HAKKITA'}. Gunakan tools bila pertanyaan membutuhkan data spesifik.`;
}
