import 'server-only';
import { buildWilayahIndex, recommendPrograms, todayWIB } from '@hakkita/domain';
import type { Recommendation } from '@hakkita/domain';
import type { PreferensiProfil } from '@hakkita/schema';
import { loadPrograms, loadWilayahFile } from './data';

export async function loadRecommendations(preferensi: PreferensiProfil): Promise<Recommendation[]> {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  return recommendPrograms(programs, preferensi, {
    today: todayWIB(),
    wilayahIndex: buildWilayahIndex(wilayahFile.wilayah),
  });
}
