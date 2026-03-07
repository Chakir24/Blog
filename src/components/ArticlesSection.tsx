'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleStatusCard } from './ArticleStatusCard';
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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

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
            Glissez pour parcourir, comme des statuts WhatsApp
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap gap-2"
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

        {/* Conteneur style défilement WhatsApp */}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            aria-label="Défiler à gauche"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--card)]/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-[var(--accent)]/20 md:-left-4"
          >
            <ChevronLeft size={24} className="text-[var(--foreground)]" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Défiler à droite"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[var(--card)]/90 p-2 shadow-lg backdrop-blur-sm transition hover:bg-[var(--accent)]/20 md:-right-4"
          >
            <ChevronRight size={24} className="text-[var(--foreground)]" />
          </button>

          <div
            ref={scrollRef}
            className="articles-status-scroll flex overflow-x-auto pb-4 scroll-smooth"
          >
            {/* Espacement pour le premier élément */}
            <div className="shrink-0 w-2" />{' '}
            {filtered.map((article, i) => (
              <ArticleStatusCard
                key={article.slug}
                article={article}
                index={i}
                categoryLabel={categoryLabels[article.category] ?? article.category}
              />
            ))}
            {/* Espacement pour le dernier élément */}
            <div className="shrink-0 w-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
