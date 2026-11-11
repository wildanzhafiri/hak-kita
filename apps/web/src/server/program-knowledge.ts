import 'server-only';
import {
  buildCuratedKnowledge,
  buildProgramKnowledge,
  searchProgramKnowledge,
} from '@hakkita/domain';
import type { ProgramKnowledgePassage, ProgramKnowledgeSearchOptions } from '@hakkita/domain';
import { loadPublishedInformation, loadKnowledgeDocuments } from './data';

export async function findProgramKnowledge(
  query: string,
  options: ProgramKnowledgeSearchOptions = {},
): Promise<ProgramKnowledgePassage[]> {
  const [programs, documents] = await Promise.all([
    loadPublishedInformation(),
    loadKnowledgeDocuments(),
  ]);
  const passages = [
    ...buildProgramKnowledge(programs),
    ...buildCuratedKnowledge(documents, programs),
  ];
  return searchProgramKnowledge(passages, query, options);
}
