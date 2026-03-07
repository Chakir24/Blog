'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import type { ArticleCard as ArticleCardType } from '@/lib/types';

interface Category {
  id: string;
  label: string;
}

interface ArticlesSectionProps {
  articles: ArticleCardType[];
}

export function ArticlesSection({ articles }: ArticlesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const categoryLabels = Object.fromEntries(categories.map((c) => [c.id, c.label]));
  const categoryIds = categories.map((c) => c.id);
  const filtered =
    activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <section id="articles" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 md:scroll-mt-24 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
            Articles récents
          </h2>
          <p className="mt-3 text-base text-[var(--muted-foreground)] sm:mt-4 sm:text-lg">
            Réflexions, lifestyle, créativité et inspiration
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap gap-2"
        >
          <button
            key="all"
            onClick={() => setActiveCategory('all')}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25'
                : 'border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]'
            }`}
          >
            Tous
          </button>
          {categoryIds.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25'
                  : 'border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]'
              }`}
            >
              {categoryLabels[cat] ?? cat}
            </button>
          ))}
        </motion.div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="wait">
            {filtered.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                index={i}
                categoryLabel={categoryLabels[article.category] ?? article.category}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
