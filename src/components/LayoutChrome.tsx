'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { SettingsProvider } from './SettingsProvider';
import { Header } from './Header';
import { Footer } from './Footer';

const BackToTop = dynamic(() => import('./BackToTop').then((m) => ({ default: m.BackToTop })), {
  ssr: false,
});

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <SettingsProvider>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <BackToTop />}
    </SettingsProvider>
  );
}
