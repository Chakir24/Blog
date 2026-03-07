'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { addCategory, removeCategory } from '@/app/actions/categories';

interface Category {
  id: string;
  label: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { credentials: 'include' });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const label = newLabel.trim();
    if (!label) return;

    setSubmitting(true);
    try {
      const result = await addCategory(label);
      if (!result.ok) {
        if (result.redirect) window.location.href = result.redirect;
        throw new Error(result.error);
      }
      if (result.data) setCategories((prev) => [...prev, result.data!]);
      setNewLabel('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Supprimer la catégorie « ${categories.find((c) => c.id === id)?.label} » ?`)) return;

    try {
      const result = await removeCategory(id);
      if (!result.ok) {
        if (result.redirect) window.location.href = result.redirect;
        throw new Error(result.error);
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <Link
        href="/admin"
        className="mb-8 inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={18} />
        Retour au tableau de bord
      </Link>

      <h1 className="font-serif text-2xl font-bold sm:text-3xl">Catégories</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Gérez les catégories utilisées pour classer vos articles
      </p>

      {error && (
        <div className="mt-6 rounded-xl bg-red-500/20 p-4 text-red-500">{error}</div>
      )}

      <form onSubmit={handleAdd} className="mt-8 flex flex-wrap gap-3">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Nouvelle catégorie (ex. Voyage)"
          className="min-w-[200px] flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
        />
        <button
          type="submit"
          disabled={submitting || !newLabel.trim()}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          <Plus size={18} />
          {submitting ? 'Ajout...' : 'Ajouter'}
        </button>
      </form>

      <div className="mt-12">
        <h2 className="mb-4 font-semibold">Catégories existantes</h2>
        {loading ? (
          <p className="text-[var(--muted-foreground)]">Chargement...</p>
        ) : categories.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">Aucune catégorie</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3"
              >
                <div>
                  <span className="font-medium">{cat.label}</span>
                  <span className="ml-2 font-mono text-sm text-[var(--muted-foreground)]">
                    {cat.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-red-500/20 hover:text-red-500"
                  aria-label={`Supprimer ${cat.label}`}
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
