'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Clock, ArrowLeft } from 'lucide-react';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { Reactions } from '@/components/Reactions';
import { Comments } from '@/components/Comments';
import { ArticleCard } from '@/components/ArticleCard';
import type { Article, ArticleCard as ArticleCardType } from '@/lib/types';

interface ArticleLayoutProps {
  article: Article;
  related: ArticleCardType[];
  categoryLabel: string;
  categoryLabels?: Record<string, string>;
}

export function ArticleLayout({ article, related, categoryLabel, categoryLabels = {} }: ArticleLayoutProps) {
  return (
    <>
      <ReadingProgress />
      <article className="min-h-screen pt-28 sm:pt-24">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/#articles"
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)] sm:mb-8 sm:text-base"
            >
              <ArrowLeft size={18} />
              Retour aux articles
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="rounded-lg bg-[var(--accent)]/20 px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                {categoryLabel}
              </span>
              <span className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Clock size={16} />
                {article.readingTime} min de lecture
              </span>
              <time
                dateTime={article.publishedAt}
                className="text-sm text-[var(--muted-foreground)]"
              >
                {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>

            <h1 className="font-serif text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              {article.title}
            </h1>

            <p className="mt-4 text-base text-[var(--muted-foreground)] sm:mt-6 sm:text-lg">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
              <Link
                href="/a-propos"
                className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-[var(--accent)]/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20 font-bold text-[var(--accent)]">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{article.author}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">À propos</p>
                </div>
              </Link>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-8 sm:mt-16 sm:gap-12 lg:grid-cols-[1fr_280px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-sm max-w-none sm:prose-base md:prose-lg [&_h2]:scroll-mt-28 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:scroll-mt-28 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 sm:[&_h2]:text-2xl sm:[&_h2]:mt-12 sm:[&_h2]:mb-4 sm:[&_h3]:text-xl sm:[&_h3]:mt-8 sm:[&_h3]:mb-3 [&_p]:mb-3 [&_p]:leading-relaxed sm:[&_p]:mb-4 [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-[var(--accent-hover)] [&_code]:bg-[var(--glass)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-[var(--card)] [&_pre]:border [&_pre]:border-[var(--card-border)] [&_pre]:rounded-xl [&_pre]:p-3 [&_pre]:text-sm sm:[&_pre]:p-4 sm:[&_pre]:text-base [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--muted-foreground)]"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                {article.content.trim()}
              </ReactMarkdown>
            </motion.div>

            <aside className="hidden lg:block">
              <TableOfContents />
            </aside>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 sm:mt-16"
          >
            <Reactions slug={article.slug} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 sm:mt-16"
          >
            <Comments slug={article.slug} />
          </motion.div>

          {related.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 sm:mt-24"
            >
              <h2 className="mb-6 font-serif text-xl font-bold sm:mb-8 sm:text-2xl">
                Articles recommandés
              </h2>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((a, i) => (
                  <ArticleCard
                    key={a.slug}
                    article={a}
                    index={i}
                    categoryLabel={categoryLabels[a.category] ?? a.category}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </article>
    </>
  );
}
