import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SiteFrame } from '@/components/layout/site-frame';
import { AuthProvider } from '@/components/layout/auth-provider';
import { AssistantChat } from '@/features/assistant/assistant-chat';
import type { RootLayoutProps } from './types';

export const metadata: Metadata = {
  title: {
    default: 'HAKKITA | Program dan layanan publik',
    template: '%s · HAKKITA',
  },
  description:
    'Temukan program publik, pahami panduan layanan, dan siapkan langkah berikutnya dengan rujukan yang jelas.',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <SiteFrame header={<Header />} footer={<Footer />}>
            {children}
          </SiteFrame>
          <AssistantChat />
        </AuthProvider>
      </body>
    </html>
  );
}
