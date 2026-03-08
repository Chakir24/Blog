'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from './SettingsProvider';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'MH';
}

export function Hero() {
  const [imageError, setImageError] = useState(false);
  const settings = useSettings();

  const profileSrc = settings.profileImage || '/profile.jpg';

  // Réinitialiser imageError quand l'URL change (nouvelle image uploadée)
  useEffect(() => {
    setImageError(false);
  }, [profileSrc]);
  const initials = getInitials(settings.authorName || 'Manftou Hath');

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-28 sm:px-6 md:pt-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link href="/a-propos" className="block">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--glass-border)] ring-4 ring-[var(--accent)]/20 md:h-28 md:w-28">
            {profileSrc && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileSrc}
                alt={settings.authorName || 'Profil'}
                className="h-full w-full object-cover"
                fetchPriority="high"
                loading="eager"
                decoding="async"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent)] to-violet-500 text-2xl font-bold text-white md:text-3xl">
                {initials}
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex flex-wrap items-center justify-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2"
      >
        <Sparkles size={16} className="text-[var(--accent)]" />
        <span className="text-center text-xs font-medium text-[var(--muted-foreground)] sm:text-sm">
          {settings.slogan || 'Réflexions · Créativité · Inspiration'}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl text-center font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
      >
        Partager ses idées
        <br />
        <span className="bg-gradient-to-r from-[var(--accent)] to-violet-400 bg-clip-text text-transparent">
          à travers la toile
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-2xl text-center text-base text-[var(--muted-foreground)] sm:text-lg md:text-xl"
      >
        Un espace pour mes réflexions, mes coups de cœur et tout ce qui me fait
        vibrer. Bienvenue dans mon petit coin d&apos;Internet.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
      >
        <Link
          href="/#articles"
          className="group flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 font-semibold text-white transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-[var(--accent)]/25"
        >
          Lire les articles
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
        <Link
          href="/a-propos"
          className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-8 py-4 font-semibold transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10"
        >
          En savoir plus
        </Link>
        <Link
          href="/#contact"
          className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-8 py-4 font-semibold transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10"
        >
          Me contacter
        </Link>
      </motion.div>
    </section>
  );
}
