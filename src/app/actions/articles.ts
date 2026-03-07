'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getArticles, saveArticles, deleteArticle, getSubscribers } from '@/lib/storage';
import { sendArticleNotification } from '@/lib/email';
import type { Article } from '@/lib/types';

type ActionResult = { ok: true } | { ok: false; error: string; redirect?: string };

async function checkAuth(): Promise<ActionResult | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (session?.value !== 'authenticated') {
    return { ok: false, error: 'Session expirée', redirect: '/admin/login' };
  }
  return null;
}

export async function addArticle(article: Article): Promise<ActionResult> {
  const authError = await checkAuth();
  if (authError) return authError;
  const articles = await getArticles();
  if (articles.some((a) => a.slug === article.slug)) {
    return { ok: false, error: 'Slug already exists' };
  }
  try {
    articles.unshift(article);
    await saveArticles(articles);

    if (process.env.RESEND_API_KEY) {
      const subscribers = await getSubscribers();
      const emails = subscribers.map((s) => s.email);
      if (emails.length > 0) {
        sendArticleNotification(article, emails).catch(() => {});
      }
    }
    revalidatePath('/admin/articles');
    revalidatePath('/admin/articles/new');
    revalidatePath('/', 'layout');
    revalidatePath('/articles', 'layout');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur' };
  }
}

export async function updateArticle(slug: string, article: Article): Promise<ActionResult> {
  const authError = await checkAuth();
  if (authError) return authError;
  try {
    const articles = await getArticles();
    const index = articles.findIndex((a) => a.slug === slug);
    if (index === -1) return { ok: false, error: 'Not found' };
    articles[index] = article;
    await saveArticles(articles);
    revalidatePath('/admin/articles');
    revalidatePath(`/admin/articles/${slug}/edit`);
    revalidatePath('/', 'layout');
    revalidatePath('/articles', 'layout');
    revalidatePath(`/articles/${slug}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur' };
  }
}

export async function removeArticle(slug: string): Promise<ActionResult> {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const articles = await getArticles();
    if (!articles.some((a) => a.slug === slug)) return { ok: false, error: 'Not found' };
    await deleteArticle(slug);
    revalidatePath('/admin/articles');
    revalidatePath('/', 'layout');
    revalidatePath('/articles', 'layout');
    revalidatePath(`/articles/${slug}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur' };
  }
}
