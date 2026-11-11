import type { Program } from '@hakkita/schema';
import type { RadarProgramCandidateView } from '@/server/types';

type RadarProgramEvidence = RadarProgramCandidateView['record']['evidence'][number];

function collectQuotes(evidence: RadarProgramEvidence[]): Map<string, string> {
  const quotesByUrl = new Map<string, string[]>();
  for (const item of evidence) {
    const quotes = quotesByUrl.get(item.url) ?? [];
    if (!quotes.includes(item.quote)) quotes.push(item.quote);
    quotesByUrl.set(item.url, quotes);
  }
  return new Map([...quotesByUrl].map(([url, quotes]) => [url, quotes.join('\n\n')]));
}

export function attachEvidenceQuotes(program: Program, evidence: RadarProgramEvidence[]): Program {
  const quotes = collectQuotes(evidence);
  const withQuote = <Source extends Program['sumberUtama']>(source: Source): Source => {
    const quote = quotes.get(source.url);
    return source.kutipan || !quote ? source : { ...source, kutipan: quote };
  };
  return {
    ...program,
    sumberUtama: withQuote(program.sumberUtama),
    sumberTambahan: program.sumberTambahan.map(withQuote),
  };
}
