'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import { ArticleContentEditor } from '@/components/ArticleContentEditor';
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'reflexions',
    publishedAt: article?.publishedAt || new Date().toISOString().split('T')[0],
    author: article?.author || 'Manftou Hath',
    image: article?.image || '',
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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/articles/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const readingTime = estimateReadingTime(form.content);
    const payload: Article = { ...form, readingTime, image: form.image || undefined };
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
          <ArticleContentEditor
            value={form.content}
            onChange={(v) => setForm((f) => ({ ...f, content: v }))}
            rows={15}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Utilisez la barre d&apos;outils pour le formatage et le bouton Image pour insérer des images.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Image de couverture (accueil)</label>
          <p className="mb-3 text-xs text-[var(--muted-foreground)]">
            Image d&apos;arrière-plan de la carte sur la page d&apos;accueil (style statuts WhatsApp). Laissez vide pour le fond par défaut.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {form.image && (
              <div className="h-32 w-48 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--card-border)] bg-[var(--glass)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm font-medium hover:bg-[var(--glass)]">
                <ImagePlus size={16} />
                {uploadingCover ? 'Upload...' : form.image ? 'Remplacer' : 'Ajouter une image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>
              {form.image && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image: '' }))}
                  className="w-fit text-sm text-[var(--muted-foreground)] hover:text-red-500"
                >
                  Supprimer
                </button>
              )}
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="ou coller une URL"
                className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm"
              />
            </div>
          </div>
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
