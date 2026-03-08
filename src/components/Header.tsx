'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, Menu, X, LayoutDashboard } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { useSettings } from './SettingsProvider';

const SearchModal = dynamic(() => import('./SearchModal').then((m) => ({ default: m.SearchModal })), {
  ssr: false,
});

const navLinks = [
  { href: '/#articles', label: 'Articles' },
  { href: '/#expertise', label: 'Expertise' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/#contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const settings = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.authenticated === true))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    const updateHash = () => setCurrentHash(typeof window !== 'undefined' ? window.location.hash : '');
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, [pathname]);

  // Scroll spy : met à jour le lien actif selon la section visible
  useEffect(() => {
    if (pathname !== '/') return;
    const sectionIds = ['articles', 'expertise', 'contact'];
    const updateActiveSection = () => {
      const viewportTop = window.scrollY + 200;
      let activeId = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= viewportTop) activeId = id;
        }
      }
      setCurrentHash('#' + activeId);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--glass-border)] bg-[var(--background)]/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-6xl flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight transition-colors hover:text-[var(--accent)] md:text-2xl"
          >
            {settings.siteName || 'Manftou Hath'}
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isHashLink = link.href.startsWith('/#');
              const linkHash = isHashLink ? '#' + link.href.split('#')[1] : '';
              const hash = pathname === '/' && !currentHash ? '#articles' : currentHash;
              const active = isHashLink
                ? pathname === '/' && hash === linkHash
                : pathname === link.href;
              const linkClass = `text-sm font-medium transition-colors ${
                active ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`;
              if (isHashLink && pathname === '/') {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setCurrentHash(linkHash)}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              );
            })}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
                title="Tableau de bord admin"
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)] md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex shrink-0 items-center justify-center rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)] md:px-3"
              aria-label="Rechercher un article"
            >
              <Search size={20} />
              <kbd className="hidden rounded border border-[var(--card-border)] px-2 py-0.5 text-xs md:inline-block">
                ⌘K
              </kbd>
            </button>
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
        {menuOpen && (
          <motion.div
            key="menu-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-72 flex-col border-l border-[var(--glass-border)] bg-[var(--background)] p-6 md:hidden"
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
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-lg font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
                >
                  <LayoutDashboard size={20} />
                  Dashboard admin
                </Link>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-lg font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
              >
                <Search size={20} />
                Rechercher un article
              </button>
              {navLinks.map((link) => {
                const isHashLink = link.href.startsWith('/#');
                const linkHash = isHashLink ? '#' + link.href.split('#')[1] : '';
                const hash = pathname === '/' && !currentHash ? '#articles' : currentHash;
                const active = isHashLink
                  ? pathname === '/' && hash === linkHash
                  : pathname === link.href;
                const linkClass = `rounded-xl px-4 py-3 text-lg font-medium transition-colors ${
                  active
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]'
                }`;
                if (isHashLink && pathname === '/') {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setCurrentHash(linkHash);
                        setMenuOpen(false);
                      }}
                      className={linkClass}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
