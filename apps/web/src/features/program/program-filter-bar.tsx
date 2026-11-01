import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextInput } from '@/components/ui/text-input';
import type { ProgramFilterBarProps } from './types';

export function ProgramFilterBar({ filters, placeholder, mode = 'filters' }: ProgramFilterBarProps) {
  if (mode === 'search') {
    return (
      <form
        className="flex min-h-[62px] items-center overflow-hidden rounded-[9px] border border-[#b9c1ca] bg-white focus-within:outline-2 focus-within:outline-[#bed9f8] focus-within:outline-offset-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search className="ml-[22px] shrink-0 text-[#9099a4]" size={20} />
        <TextInput
          className="!min-w-0 !flex-1 !rounded-none !border-0 !bg-transparent !px-3 !py-[18px] !text-[15px] !text-[#292b2e] !shadow-none !outline-none !ring-0 placeholder:!text-[#77808c] focus:!border-0 focus:!shadow-none focus:!ring-0"
          value={filters.query}
          onChange={(event) => filters.setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Cari"
        />
        <Button
          className="!h-full !min-h-[60px] !min-w-[122px] !shrink-0 !rounded-none !px-5 !text-[17px] max-[480px]:!min-w-[86px]"
          type="submit"
        >
          Cari
        </Button>
      </form>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1">
      <div className="flex min-w-0 flex-col gap-2 text-xs font-medium text-[#536477]">
        <span>Kategori</span>
        <SelectField
          label="Kategori"
          placeholder="Semua kategori"
          value={filters.kategori}
          options={[
            { value: '__all__', label: 'Semua kategori' },
            ...filters.kategoriOptions.map((kategori) => ({ value: kategori, label: kategori })),
          ]}
          onChange={(value) => filters.selectKategori(value === '__all__' ? '' : value)}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2 text-xs font-medium text-[#536477]">
        <span>Provinsi</span>
        <SelectField
          label="Provinsi"
          placeholder="Semua wilayah"
          value={filters.provinsi}
          options={[
            { value: '__all__', label: 'Semua wilayah' },
            ...filters.provinsiOptions.map((wilayah) => ({
              value: wilayah.kode,
              label: wilayah.nama,
            })),
          ]}
          onChange={(value) => filters.selectProvinsi(value === '__all__' ? '' : value)}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2 text-xs font-medium text-[#536477]">
        <span>Kabupaten atau kota</span>
        <SelectField
          label="Kabupaten atau kota"
          placeholder={filters.provinsi ? 'Semua di provinsi ini' : 'Pilih provinsi dulu'}
          value={filters.kabkota}
          options={[
            {
              value: '__all__',
              label: filters.provinsi ? 'Semua di provinsi ini' : 'Pilih provinsi dulu',
            },
            ...filters.kabkotaOptions.map((wilayah) => ({
              value: wilayah.kode,
              label: wilayah.nama,
            })),
          ]}
          isDisabled={filters.kabkotaOptions.length === 0}
          onChange={(value) => filters.selectKabkota(value === '__all__' ? '' : value)}
        />
      </div>
    </div>
  );
}
