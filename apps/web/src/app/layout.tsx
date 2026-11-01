import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SiteFrame } from '@/components/layout/site-frame';
import type { RootLayoutProps } from './types';

export const metadata: Metadata = {
  title: {
    default: 'HAKKITA — Program dan layanan publik',
    template: '%s · HAKKITA',
  },
  description:
    'Temukan program publik, pahami panduan layanan, dan siapkan langkah berikutnya dengan rujukan yang jelas.',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <body>
        <SiteFrame header={<Header />} footer={<Footer />}>
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}
