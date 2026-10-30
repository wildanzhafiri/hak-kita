import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="HAKKITA beranda">
      <span className="logo-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
      HAK<span>KITA</span>
      <span className="logo-dot">.</span>
    </Link>
  );
}
