'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getArticles, saveArticles, deleteArticle, getSubscribers } from '@/lib/storage';
import { sendArticleNotification } from '@/lib/email';
import type { Article } from '@/lib/types';

async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (session?.value !== 'authenticated') {
    redirect('/admin/login');
  }
}

export async function addArticle(article: Article) {
  await requireAuth();
  const articles = await getArticles();
  if (articles.some((a) => a.slug === article.slug)) {
    throw new Error('Slug already exists');
  }
  articles.unshift(article);
  await saveArticles(articles);

  if (process.env.RESEND_API_KEY) {
    const subscribers = await getSubscribers();
    const emails = subscribers.map((s) => s.email);
    if (emails.length > 0) {
      sendArticleNotification(article, emails).catch(() => {});
    }
  }
}

export async function updateArticle(slug: string, article: Article) {
  await requireAuth();
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) throw new Error('Not found');
  articles[index] = article;
  await saveArticles(articles);
}

export async function removeArticle(slug: string) {
  await requireAuth();
  const articles = await getArticles();
  if (!articles.some((a) => a.slug === slug)) throw new Error('Not found');
  await deleteArticle(slug);
}
