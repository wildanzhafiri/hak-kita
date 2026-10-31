import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SiteFrame } from '@/components/layout/site-frame';
import type { RootLayoutProps } from './types';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HAKKITA — Lebih dekat dengan hakmu',
    template: '%s · HAKKITA',
  },
  description:
    'Temukan bantuan, urus layanan, dan pahami informasi publik dalam satu tempat, dengan sumber resmi dan status verifikasi yang selalu ditampilkan.',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <SiteFrame header={<Header />} footer={<Footer />}>
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}
