'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Article } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch('/api/articles', { cache: 'no-store' }).then((res) => res.json()).catch(() => []),
        fetch('/api/categories', { cache: 'no-store' }).then((res) => res.json()).catch(() => []),
      ]).then(([arts, cats]) => {
        setArticles(Array.isArray(arts) ? arts : []);
        const labels = Object.fromEntries(
          (Array.isArray(cats) ? cats : []).map((c: { id: string; label: string }) => [c.id, c.label])
        );
        setCategoryLabels(labels);
      });
    }
  }, [isOpen]);

  const filtered = useCallback(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (categoryLabels[a.category] ?? a.category).toLowerCase().includes(q)
    );
  }, [query, articles, categoryLabels]);

  useEffect(() => {
    setSuggestions(filtered());
    setSelectedIndex(0);
  }, [query, filtered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && suggestions[selectedIndex]) {
        window.location.href = `/articles/${suggestions[selectedIndex].slug}`;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, suggestions, selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="search-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        key="search-modal-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed left-4 right-4 top-20 z-[101] sm:left-1/2 sm:right-auto sm:top-1/4 sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:px-4"
      >
        <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card)] shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-[var(--glass-border)] px-4 py-3">
            <Search size={20} className="text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-2 sm:max-h-80">
            {suggestions.length === 0 ? (
              <p className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                {articles.length === 0 ? 'Chargement...' : 'Aucun résultat trouvé'}
              </p>
            ) : (
              suggestions.map((article, i) => (
                <Link
                  key={article.slug || `article-${i}`}
                  href={`/articles/${article.slug}`}
                  onClick={onClose}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    i === selectedIndex ? 'bg-[var(--glass)]' : ''
                  }`}
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/20">
                    <Clock size={14} className="text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{article.title}</p>
                    <p className="truncate text-sm text-[var(--muted-foreground)]">
                      {categoryLabels[article.category] ?? article.category} · {article.readingTime} min
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
