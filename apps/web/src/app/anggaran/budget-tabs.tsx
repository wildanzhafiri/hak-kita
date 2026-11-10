import Link from 'next/link';

interface BudgetTabsProps {
  scope: 'apbn' | 'apbd';
}

const TABS = [
  { id: 'apbn', label: 'Anggaran Nasional (APBN)' },
  { id: 'apbd', label: 'Anggaran Daerah (APBD)' },
] as const;

export function BudgetTabs({ scope }: BudgetTabsProps) {
  return (
    <nav
      aria-label="Jenis anggaran"
      className="mb-5 flex border-b border-[#e1e9f2] max-[640px]:grid max-[640px]:grid-cols-2"
    >
      {TABS.map((tab) => (
        <Link
          aria-current={scope === tab.id ? 'page' : undefined}
          className={
            scope === tab.id
              ? 'inline-flex min-h-12 items-center justify-center border-b-[3px] border-[#1769c2] px-3 py-3 text-center text-sm font-semibold leading-5 text-[#1769c2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2] min-[640px]:px-[18px]'
              : 'inline-flex min-h-12 items-center justify-center border-b-[3px] border-transparent px-3 py-3 text-center text-sm font-semibold leading-5 text-[#253044] hover:text-[#1769c2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2] min-[640px]:px-[18px]'
          }
          href={`/anggaran?scope=${tab.id}`}
          key={tab.id}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
