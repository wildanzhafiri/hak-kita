import { Search } from 'lucide-react';
import type { ProgramFilterBarProps } from './types';

export function ProgramFilterBar({ filters, placeholder }: ProgramFilterBarProps) {
  return (
    <div className="filter-bar">
      <label className="filter-search">
        <Search size={18} />
        <input
          value={filters.query}
          onChange={(e) => filters.setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Cari"
        />
      </label>
      <select
        aria-label="Kategori"
        value={filters.kategori ?? ''}
        onChange={(e) => filters.selectKategori(e.target.value)}
      >
        <option value="">Semua kategori</option>
        {filters.kategoriOptions.map((kategori) => (
          <option key={kategori} value={kategori}>
            {kategori}
          </option>
        ))}
      </select>
      <select
        aria-label="Provinsi"
        value={filters.provinsi ?? ''}
        onChange={(e) => filters.selectProvinsi(e.target.value)}
      >
        <option value="">Semua wilayah</option>
        {filters.provinsiOptions.map((w) => (
          <option key={w.kode} value={w.kode}>
            {w.nama}
          </option>
        ))}
      </select>
      <select
        aria-label="Kabupaten atau kota"
        value={filters.kabkota ?? ''}
        onChange={(e) => filters.selectKabkota(e.target.value)}
        disabled={filters.kabkotaOptions.length === 0}
      >
        <option value="">
          {filters.provinsi ? 'Semua di provinsi ini' : 'Pilih provinsi dulu'}
        </option>
        {filters.kabkotaOptions.map((w) => (
          <option key={w.kode} value={w.kode}>
            {w.nama}
          </option>
        ))}
      </select>
    </div>
  );
}
