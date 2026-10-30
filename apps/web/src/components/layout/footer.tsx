import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { SERVICE_SECTIONS } from '@/config/sections';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Lebih dekat dengan hakmu.
            <br />
            Lebih mudah melangkah maju.
          </p>
          <span className="footer-tag">
            <Sparkles size={14} /> Dibangun untuk masyarakat.
          </span>
        </div>
        <div>
          <h4>Jelajahi layanan</h4>
          {SERVICE_SECTIONS.map((section) => (
            <Link key={section.slug} href={`/${section.slug}`}>
              {section.nama}
            </Link>
          ))}
        </div>
        <div>
          <h4>Informasi & transparansi</h4>
          <Link href="/awasi-uang-publik">Awasi Uang Publik</Link>
          <Link href="/rencanaku">Rencanaku</Link>
          <Link href="/sumber-data">Sumber & batasan data</Link>
        </div>
        <div>
          <h4>Mengenal HAKKITA</h4>
          <Link href="/tentang">Tentang kami</Link>
          <Link href="/tentang#privasi">Privasi & penyimpanan</Link>
          <p className="footer-disclaimer">
            HAKKITA adalah platform informasi dan pendukung akses layanan publik, bukan layanan
            resmi pemerintah.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 HAKKITA. Hak kita, untuk kita.</span>
        <span>
          Dibuat dengan kepedulian <span className="tiny-dot" /> Sumber resmi, status verifikasi
          selalu ditampilkan
        </span>
      </div>
    </footer>
  );
}
