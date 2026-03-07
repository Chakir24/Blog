'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Article } from '@/lib/types';
import { addArticle, updateArticle } from '@/app/actions/articles';

interface Category {
  id: string;
  label: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface ArticleFormProps {
  article?: Article;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'reflexions',
    publishedAt: article?.publishedAt || new Date().toISOString().split('T')[0],
    author: article?.author || 'Manftou Hath',
  });

  useEffect(() => {
    fetch('/api/categories', { credentials: 'include', cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const cats = Array.isArray(data) ? data : [];
        setCategories(cats);
        const defaultId = cats[0]?.id ?? 'reflexions';
        setForm((f) => {
          const valid = cats.some((c: Category) => c.id === f.category);
          return valid ? f : { ...f, category: defaultId };
        });
      })
      .catch(() => setCategories([]));
  }, []);

  const defaultCategory = categories[0]?.id ?? 'reflexions';
  const formCategory = form.category && categories.some((c) => c.id === form.category)
    ? form.category
    : defaultCategory;

  const updateSlug = (title: string) => {
    if (!article) setForm((f) => ({ ...f, slug: slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const readingTime = estimateReadingTime(form.content);
    const payload: Article = { ...form, readingTime };
    try {
      const result = article
        ? await updateArticle(article.slug, payload)
        : await addArticle(payload);
      if (!result.ok) {
        if (result.redirect) router.push(result.redirect);
        throw new Error(result.error);
      }
      alert(article ? 'Article modifié avec succès.' : 'Article publié avec succès.');
      router.push('/admin/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-12 max-w-3xl">
      <Link
        href="/admin/articles"
        className="mb-8 inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={18} />
        Retour aux articles
      </Link>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/20 p-4 text-red-500">{error}</div>
      )}

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Titre</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              setForm((f) => ({ ...f, title: e.target.value }));
              updateSlug(e.target.value);
            }}
            required
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Slug (URL)</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Extrait</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            required
            rows={2}
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Contenu (Markdown)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            required
            rows={15}
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 font-mono text-sm"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Catégorie</label>
            <select
              value={formCategory}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Date de publication</label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[var(--accent)] px-8 py-3 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : article ? 'Mettre à jour' : 'Publier'}
        </button>
        <Link
          href="/admin/articles"
          className="rounded-xl border border-[var(--card-border)] px-8 py-3 font-semibold hover:bg-[var(--glass)]"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
