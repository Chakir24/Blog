'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { ArticleCard as ArticleCardType } from '@/lib/types';

interface ArticleCardProps {
  article: ArticleCardType;
  index?: number;
  categoryLabel?: string;
}

export function ArticleCard({ article, index = 0, categoryLabel }: ArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/articles/${article.slug}`}>
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-xl hover:shadow-[var(--accent)]/5 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative">
            <span className="inline-block rounded-lg bg-[var(--accent)]/20 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              {categoryLabel ?? article.category}
            </span>

            <h3 className="mt-3 font-serif text-lg font-bold leading-tight transition-colors group-hover:text-[var(--accent)] sm:mt-4 sm:text-xl md:text-2xl">
              {article.title}
            </h3>

            <p className="mt-3 line-clamp-2 text-sm text-[var(--muted-foreground)]">
              {article.excerpt}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted-foreground)] sm:mt-4 sm:text-sm">
              <span className="flex items-center gap-1">
                <Clock size={14} className="shrink-0" />
                {article.readingTime} min
              </span>
              <span className="hidden text-[var(--muted)] sm:inline">·</span>
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
    </motion.article>
  );
}
