'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCategories, saveCategories, deleteCategory, getArticles } from '@/lib/storage';
import type { Category } from '@/lib/storage';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (session?.value !== 'authenticated') {
    redirect('/admin/login');
  }
}

export async function addCategory(label: string) {
  await requireAuth();
  const id = slugify(label.trim());
  if (!id) throw new Error('Impossible de générer un identifiant');

  const categories = await getCategories();
  if (categories.some((c) => c.id === id)) {
    throw new Error('Cette catégorie existe déjà');
  }

  categories.push({ id, label: label.trim() });
  await saveCategories(categories);
  return { id, label: label.trim() };
}

export async function removeCategory(id: string) {
  await requireAuth();
  const [categories, articles] = await Promise.all([
    getCategories(),
    getArticles(),
  ]);
  if (!categories.some((c) => c.id === id)) {
    throw new Error('Catégorie introuvable');
  }
  if (articles.some((a) => a.category === id)) {
    throw new Error('Impossible de supprimer : des articles utilisent cette catégorie');
  }
  await deleteCategory(id);
}
