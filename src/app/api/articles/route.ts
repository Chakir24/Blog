import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getArticles, saveArticles, getSubscribers } from '@/lib/storage';
import { sendArticleNotification } from '@/lib/email';
import type { Article } from '@/lib/types';

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json(articles, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const article: Article = await request.json();
    const articles = await getArticles();

    if (articles.some((a) => a.slug === article.slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    articles.unshift(article);
    await saveArticles(articles);

    // Envoyer les notifications aux abonnés (en arrière-plan, sans bloquer)
    if (process.env.RESEND_API_KEY) {
      const subscribers = await getSubscribers();
      const emails = subscribers.map((s) => s.email);
      if (emails.length > 0) {
        sendArticleNotification(article, emails).catch(() => {});
      }
    }

    return NextResponse.json(article);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid data';
    console.error('[api/articles POST]', err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
