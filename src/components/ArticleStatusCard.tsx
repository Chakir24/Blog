'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { ArticleCard as ArticleCardType } from '@/lib/types';

interface ArticleStatusCardProps {
  article: ArticleCardType;
  index?: number;
  categoryLabel?: string;
}

export function ArticleStatusCard({ article, index = 0, categoryLabel }: ArticleStatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="shrink-0 snap-center snap-always"
    >
      <Link href={`/articles/${article.slug}`} className="block">
        <div
          className="group relative mx-2 flex h-[320px] w-[280px] flex-col overflow-hidden rounded-2xl border-2 border-[var(--accent)]/30 shadow-lg transition-all duration-300 hover:border-[var(--accent)]/70 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] sm:mx-3 sm:w-[300px]"
          style={
            article.image
              ? {
                  backgroundImage: `url(${article.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : { backgroundColor: 'var(--card)' }
          }
        >
          {article.image && (
            <div className="absolute inset-0 bg-[var(--background)]/70" aria-hidden />
          )}
          <div className="relative flex flex-1 flex-col p-5">
            <span className="inline-block w-fit rounded-full bg-[var(--accent)]/25 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              {categoryLabel ?? article.category}
            </span>

            <h3 className="mt-3 line-clamp-2 font-serif text-lg font-bold leading-tight transition-colors group-hover:text-[var(--accent)] sm:text-xl">
              {article.title}
            </h3>

            <p className="mt-2 flex-1 line-clamp-3 text-sm text-[var(--muted-foreground)]">
              {article.excerpt}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1">
                <Clock size={12} className="shrink-0" />
                {article.readingTime} min
              </span>
              <span className="text-[var(--muted)]">·</span>
              <time dateTime={article.publishedAt} className="whitespace-nowrap">
                {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
