import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { createAssistantTools } from './assistant';

const toolOptions = { toolCallId: 'call-1', messages: [] } as never;

function mockTavily(payload: unknown, ok = true) {
  const fetchMock = vi.fn(async () => ({ ok, json: async () => payload }) as Response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('official web tools', () => {
  const tools = createAssistantTools(null, null);

  beforeEach(() => {
    process.env.TAVILY_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.TAVILY_API_KEY;
    vi.unstubAllGlobals();
  });

  it('keeps only https results from official domains and marks them unverified', async () => {
    mockTavily({
      results: [
        { title: 'Paspor Baru', url: 'https://www.imigrasi.go.id/wni/paspor-baru', content: 'Isi' },
        { title: 'Blog', url: 'https://contoh.com/paspor', content: 'Bukan resmi' },
        { title: 'Tidak aman', url: 'http://www.imigrasi.go.id/lama', content: 'http' },
      ],
    });

    const output = await tools.searchOfficialWeb.execute?.({ query: 'paspor' }, toolOptions);

    expect(output).toEqual({
      available: true,
      verifiedByHakkita: false,
      results: [
        {
          title: 'Paspor Baru',
          sourceUrl: 'https://www.imigrasi.go.id/wni/paspor-baru',
          snippet: 'Isi',
        },
      ],
    });
  });

  it('restricts the search request to official domains', async () => {
    const fetchMock = mockTavily({ results: [] });

    await tools.searchOfficialWeb.execute?.({ query: 'paspor' }, toolOptions);

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.include_domains).toEqual(['go.id', 'desa.id']);
    expect(body.include_domains_mode).toBe('restrict');
  });

  it('reports unavailable when the search key or service is missing', async () => {
    delete process.env.TAVILY_API_KEY;
    expect(await tools.searchOfficialWeb.execute?.({ query: 'paspor' }, toolOptions)).toEqual({
      available: false,
      results: [],
    });

    process.env.TAVILY_API_KEY = 'test-key';
    mockTavily({}, false);
    expect(await tools.searchOfficialWeb.execute?.({ query: 'paspor' }, toolOptions)).toEqual({
      available: false,
      results: [],
    });
  });

  it('refuses to read pages outside official domains without calling the service', async () => {
    const fetchMock = mockTavily({ results: [] });

    const output = await tools.readOfficialPage.execute?.(
      { url: 'https://contoh.com/halaman' },
      toolOptions,
    );

    expect(output).toMatchObject({ available: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns trimmed page text with its source for an official page', async () => {
    mockTavily({
      results: [
        {
          url: 'https://www.imigrasi.go.id/wni/paspor-baru',
          title: 'Paspor Baru',
          raw_content: 'a'.repeat(9000),
        },
      ],
    });

    const output = (await tools.readOfficialPage.execute?.(
      { url: 'https://www.imigrasi.go.id/wni/paspor-baru' },
      toolOptions,
    )) as { available: boolean; text: string; sourceUrl: string; verifiedByHakkita: boolean };

    expect(output.available).toBe(true);
    expect(output.verifiedByHakkita).toBe(false);
    expect(output.sourceUrl).toBe('https://www.imigrasi.go.id/wni/paspor-baru');
    expect(output.text).toHaveLength(7000);
  });
});
