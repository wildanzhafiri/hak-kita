'use client';

import { useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Compass,
  GraduationCap,
  HandHeart,
  HeartPulse,
  House,
  Info,
  Landmark,
  Leaf,
  PieChart,
  Shield,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBudgetAmount, formatBudgetPercent } from './format-budget';
import type { BudgetAllocationProps } from './types';

const ICONS = {
  economy: TrendingUp,
  public: Landmark,
  education: GraduationCap,
  defense: Shield,
  social: HandHeart,
  security: ShieldCheck,
  health: HeartPulse,
  housing: House,
  religion: BookOpen,
  environment: Leaf,
  tourism: Compass,
};

export function BudgetAllocation({ sectors, year }: BudgetAllocationProps) {
  const ordered = [...sectors].sort((first, second) => second.allocation - first.allocation);
  const total = sectors.reduce((sum, sector) => sum + sector.allocation, 0);
  const [selectedId, setSelectedId] = useState(ordered[0]?.id);
  const [showAll, setShowAll] = useState(false);
  const selected = ordered.find((sector) => sector.id === selectedId) ?? ordered[0];
  const SelectedIcon = selected ? ICONS[selected.icon] : null;

  return (
    <section aria-labelledby="budget-allocation-title" className="mt-10">
      <h2
        id="budget-allocation-title"
        className="text-[clamp(20px,2vw,22px)] font-bold leading-[1.3] tracking-[-.01em] text-[#253044]"
      >
        Ke Mana Anggaran Dialokasikan?
      </h2>
      <p className="mt-2 text-sm leading-[1.6] text-[#697a8e]">
        Lihat pembagian anggaran berdasarkan bidang penggunaannya. Pilih salah satu untuk mengetahui
        lebih lanjut.
      </p>
      <div className="mt-5 rounded-2xl border border-[#dce8f5] bg-white p-6 shadow-[0_4px_14px_rgba(37,73,113,.04)] max-[640px]:p-4">
        <div className="flex flex-wrap justify-between gap-x-5 gap-y-1 border-b border-[#e6edf5] pb-3 text-xs leading-5 text-[#718196]">
          <span>
            Klasifikasi: <strong className="text-[#506178]">Belanja Pemerintah Pusat</strong>
          </span>
          <span>
            Persentase dari total Belanja Pemerintah Pusat{' '}
            <strong className="text-[#506178]">{formatBudgetAmount(total, 'T')}</strong>
          </span>
        </div>
        <div aria-label="Alokasi APBN menurut fungsi" className="mt-2 grid gap-1" role="group">
          {(showAll ? ordered : ordered.slice(0, 5)).map((sector) => {
            const SectorIcon = ICONS[sector.icon];
            const share = (sector.allocation / total) * 100;
            return (
              <Button
                aria-pressed={selected?.id === sector.id}
                className={`!h-auto !min-h-0 !w-full !justify-start !rounded-[10px] !px-2 !py-2.5 !text-left ${selected?.id === sector.id ? '!bg-[#edf5ff] ring-1 ring-[#d1e4fa]' : '!bg-white hover:!bg-[#f7faff]'}`}
                key={sector.id}
                onPress={() => setSelectedId(sector.id)}
                tone="quiet"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#eaf3ff] text-[#1769c2]"
                >
                  <SectorIcon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-[#26354b]">
                    <strong className="text-sm font-semibold leading-5">{sector.label}</strong>
                    <span className="text-xs font-normal leading-5 text-[#627b96]">
                      {formatBudgetAmount(sector.allocation, 'T')} · {formatBudgetPercent(share)}
                    </span>
                  </span>
                  <span className="mt-1 block h-[5px] overflow-hidden rounded-full bg-[#e9eef3]">
                    <span
                      className="block h-full rounded-full bg-[#1769c2]"
                      style={{ width: `${share}%` }}
                    />
                  </span>
                </span>
              </Button>
            );
          })}
        </div>
        {ordered.length > 5 && (
          <Button
            aria-expanded={showAll}
            className="!mt-2 !min-h-10 !px-3 !text-xs"
            onPress={() => setShowAll((value) => !value)}
            tone="quiet"
          >
            {showAll ? 'Tampilkan lebih sedikit' : 'Lihat seluruh bidang'}
            <ChevronDown aria-hidden="true" className={showAll ? 'rotate-180' : ''} size={15} />
          </Button>
        )}
      </div>
      {selected && SelectedIcon && (
        <aside
          aria-live="polite"
          className="mt-4 rounded-2xl border border-[#c8d9ed] bg-[#f3f7fd] p-6 shadow-[0_4px_14px_rgba(37,73,113,.07)] max-[640px]:p-[18px]"
        >
          <div className="grid grid-cols-[minmax(0,.5fr)_minmax(0,1fr)] items-center gap-5 max-[950px]:grid-cols-1">
            <div className="flex min-w-0 items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-[68px] shrink-0 items-center justify-center rounded-2xl bg-[#e6f0fc] text-[#1769c2] max-[640px]:size-[52px]"
              >
                <SelectedIcon size={34} />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-[.08em] text-[#627b96]">
                  Detail bidang anggaran
                </span>
                <h3 className="mt-1 break-words text-[clamp(22px,2.5vw,28px)] font-bold leading-[1.25] text-[#253044]">
                  {selected.label}
                </h3>
              </div>
            </div>
            <div
              aria-label="Ringkasan bidang anggaran"
              className="grid grid-cols-3 gap-3 rounded-xl border border-[#dbe7f5] bg-white p-4 shadow-[0_3px_10px_rgba(37,73,113,.04)] max-[700px]:grid-cols-1"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#e6f0fc] text-[#1769c2]"
                >
                  <Wallet size={20} />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs text-[#64748b]">Nominal anggaran</span>
                  <strong className="block break-words text-[17px] text-[#1769c2] tabular-nums">
                    {formatBudgetAmount(selected.allocation, 'T')}
                  </strong>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#e6f0fc] text-[#1769c2]"
                >
                  <CalendarDays size={20} />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs text-[#64748b]">Tahun anggaran</span>
                  <strong className="block text-[17px] text-[#1769c2]">{year}</strong>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#e6f0fc] text-[#1769c2]"
                >
                  <PieChart size={20} />
                </span>
                <div className="min-w-0">
                  <span className="block text-xs text-[#64748b]">Porsi anggaran</span>
                  <strong className="block text-[17px] text-[#1769c2]">
                    {formatBudgetPercent((selected.allocation / total) * 100)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[#e5edf6] bg-white px-4 py-3.5">
            <h4 className="text-sm font-bold text-[#253044]">
              Untuk apa anggaran ini dialokasikan?
            </h4>
            <p className="mt-1 text-sm leading-[1.6] text-[#475569]">{selected.purpose}</p>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-[1.5] text-[#475569]">
            <Info aria-hidden="true" className="mt-px shrink-0 text-[#1769c2]" size={16} />
            Pilih bidang anggaran lain pada daftar di atas untuk melihat rinciannya.
          </p>
        </aside>
      )}
    </section>
  );
}
