import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="HAKKITA beranda">
      <Image src="/hakkita-logo.png" alt="HAKKITA" width={1983} height={600} priority />
    </Link>
  );
}
