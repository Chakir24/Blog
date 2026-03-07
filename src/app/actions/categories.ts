'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getCategories, saveCategories, deleteCategory, getArticles } from '@/lib/storage';
import type { Category } from '@/lib/storage';

type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string; redirect?: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function checkAuth(): Promise<ActionResult | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (session?.value !== 'authenticated') {
    return { ok: false, error: 'Session expirée', redirect: '/admin/login' };
  }
  return null;
}

export async function addCategory(label: string): Promise<ActionResult<Category>> {
  const authError = await checkAuth();
  if (authError) return authError as ActionResult<Category>;
  try {
    const id = slugify(label.trim());
    if (!id) return { ok: false, error: 'Impossible de générer un identifiant' };

    const categories = await getCategories();
    if (categories.some((c) => c.id === id)) {
      return { ok: false, error: 'Cette catégorie existe déjà' };
    }

    const newCat = { id, label: label.trim() };
    categories.push(newCat);
    await saveCategories(categories);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/articles');
    revalidatePath('/admin/articles/new');
    revalidatePath('/', 'layout');
    return { ok: true, data: newCat };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur' };
  }
}

export async function removeCategory(id: string): Promise<ActionResult> {
  const authError = await checkAuth();
  if (authError) return authError as ActionResult;

  try {
    const [categories, articles] = await Promise.all([
      getCategories(),
      getArticles(),
    ]);
    if (!categories.some((c) => c.id === id)) {
      return { ok: false, error: 'Catégorie introuvable' };
    }
    if (articles.some((a) => a.category === id)) {
      return { ok: false, error: 'Impossible de supprimer : des articles utilisent cette catégorie' };
    }
    await deleteCategory(id);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/articles');
    revalidatePath('/admin/articles/new');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur' };
  }
}
