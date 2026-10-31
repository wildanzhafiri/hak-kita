import { buildWilayahIndex, matchPrograms } from '@hakkita/domain';
import { DataNote } from '@/components/ui/data-note';
import { MatchResultCard } from './match-result-card';
import type { MatchResultsProps } from './types';

export function MatchResults({
  programs,
  wilayah,
  profile,
  today,
  onEdit,
  onReset,
}: MatchResultsProps) {
  const results = matchPrograms(programs, {
    profile,
    today,
    wilayahIndex: buildWilayahIndex(wilayah),
  });
  const potentialCount = results.filter((result) => result.status === 'berpotensi-sesuai').length;

  return (
    <div className="condition-results">
      <div className="condition-results-heading">
        <div>
          <h2>Program yang dapat kamu periksa</h2>
          <p>
            {potentialCount > 0
              ? `${potentialCount} program berpotensi sesuai berdasarkan jawaban awalmu.`
              : 'Belum ada program yang dapat dicocokkan dari jawaban awalmu.'}
          </p>
        </div>
        <div className="condition-results-actions">
          <button className="button secondary" type="button" onClick={onEdit}>
            Ubah jawaban
          </button>
          <button className="text-button" type="button" onClick={onReset}>
            Mulai ulang
          </button>
        </div>
      </div>
      <DataNote>
        Hasil ini adalah panduan awal. HAKKITA tidak menentukan penerima program, menghitung desil,
        atau mengirim data ke situs pemerintah. Periksa semua syarat di kanal resmi.
      </DataNote>
      <div className="condition-result-list">
        {results.map((result) => (
          <MatchResultCard key={result.program.id} result={result} today={today} />
        ))}
      </div>
    </div>
  );
}
