'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageCircle, Mail, LayoutDashboard, Menu, X, Tags, Settings } from 'lucide-react';
import { LogoutButton } from './LogoutButton';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/admin/articles', icon: FileText, label: 'Articles' },
  { href: '/admin/categories', icon: Tags, label: 'Catégories' },
  { href: '/admin/comments', icon: MessageCircle, label: 'Commentaires' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { href: '/admin/settings', icon: Settings, label: 'Paramètres' },
];

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--background)] px-4 py-3 md:hidden">
        <Link href="/admin" className="font-serif text-lg font-bold">
          Admin
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-[70] flex h-full w-72 flex-col border-r border-[var(--glass-border)] bg-[var(--card)] p-6 md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-bold">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
                  aria-label="Fermer le menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-2">
                {navItems.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t border-[var(--glass-border)] pt-4">
                <Link
                  href="/"
                  className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
                >
                  Voir le blog
                </Link>
                <LogoutButton />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[var(--glass-border)] bg-[var(--card)] md:block">
        <div className="flex h-full flex-col p-6">
          <Link href="/admin" className="mb-8 font-serif text-xl font-bold">
            Admin
          </Link>
          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-[var(--glass-border)] pt-4">
            <Link
              href="/"
              className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
            >
              Voir le blog
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>
      <main className="p-4 pt-20 md:pt-8 md:ml-64 md:p-8">{children}</main>
    </div>
  );
}
