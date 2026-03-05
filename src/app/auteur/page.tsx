'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PenLine,
  BookOpen,
  Palette,
  Mail,
  Instagram,
  Twitter,
  ArrowRight,
  Facebook,
} from 'lucide-react';
import { useSettings } from '@/components/SettingsProvider';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'MH';
}

const interests = [
  { icon: PenLine, label: 'Écriture', level: 'Passion' },
  { icon: BookOpen, label: 'Lecture', level: 'Quotidien' },
  { icon: Palette, label: 'Créativité', level: 'Exploration' },
];

export default function AuteurPage() {
  const settings = useSettings();
  const initials = getInitials(settings.authorName || 'Manftou Hath');
  const socials = [
    { icon: Mail, href: `mailto:${settings.socialLinks.gmail}`, label: 'Me contacter' },
    { icon: Facebook, href: settings.socialLinks.facebook, label: 'Facebook' },
    { icon: Instagram, href: settings.socialLinks.instagram, label: 'Instagram' },
    { icon: Twitter, href: settings.socialLinks.twitter, label: 'Twitter' },
  ].filter((s) => s.href);

  return (
    <main className="min-h-screen pt-28 sm:pt-24">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left"
        >
          <div className="mb-6 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-violet-500 text-3xl font-bold text-white shadow-xl shadow-[var(--accent)]/25 sm:mb-8 sm:h-32 sm:w-32 sm:text-5xl md:mb-0 md:mr-12">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
              {settings.authorName || 'Manftou Hath'}
            </h1>
            <p className="mt-2 text-base text-[var(--accent)] sm:text-lg md:text-xl">
              {settings.authorTitle || 'Auteure & créatrice de contenu'}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted-foreground)] sm:mt-6 sm:text-lg">
              J&apos;aime partager mes idées à travers la toile. Ce blog est mon
              espace pour écrire sur ce qui me touche : réflexions de vie,
              créativité, petits bonheurs et tout ce qui m&apos;inspire. Si vous
              êtes ici, merci de faire partie du voyage.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4 md:justify-start">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm transition-colors hover:border-[var(--accent)]/30 sm:px-5 sm:py-3 sm:text-base"
                >
                  <Icon size={18} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 sm:mt-24"
        >
          <h2 className="mb-6 font-serif text-xl font-bold sm:mb-8 sm:text-2xl">Ce qui me passionne</h2>
          <div className="grid gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:gap-4 sm:p-6 md:grid-cols-2 md:p-8">
            {interests.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-start justify-between gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-3 sm:flex-row sm:items-center sm:gap-0 sm:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/20">
                    <item.icon size={20} className="text-[var(--accent)]" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="rounded-lg bg-[var(--accent)]/20 px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Link
            href="/#articles"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] sm:px-8 sm:py-4 sm:text-base"
          >
            Découvrir mes articles
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
