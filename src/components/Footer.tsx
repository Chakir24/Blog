'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Mail } from 'lucide-react';
import { useSettings } from './SettingsProvider';

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function Footer() {
  const settings = useSettings();
  const { siteName, tagline, socialLinks } = settings;

  const socials = [
    { icon: FacebookIcon, href: socialLinks.facebook, label: 'Facebook' },
    { icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
    { icon: Twitter, href: socialLinks.twitter, label: 'Twitter' },
  ].filter((s) => s.href);

  return (
    <footer id="contact" className="scroll-mt-28 border-t border-[var(--glass-border)] px-4 py-12 sm:px-6 sm:py-16 md:scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight"
            >
              {siteName || 'Manftou Hath'}
            </Link>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {tagline || 'Réflexions et idées à travers la toile'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
                aria-label={label}
              >
                <Icon size={20} />
              </motion.a>
            ))}
            {socialLinks.gmail && (
              <Link
                href={`mailto:${socialLinks.gmail}`}
                className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
                aria-label="Email"
              >
                <Mail size={20} />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 border-t border-[var(--glass-border)] pt-6 text-center text-sm text-[var(--muted-foreground)] sm:mt-12 sm:flex-row sm:gap-6 sm:pt-8 md:justify-between">
          <p>
            © {new Date().getFullYear()} Tous droits réservés · Design by{' '}
            <a
              href="https://chakir.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-hover)]"
            >
              Chakir
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/mentions" className="hover:text-[var(--foreground)]">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-[var(--foreground)]">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
