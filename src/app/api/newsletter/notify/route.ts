import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { getArticles, getSubscribers } from '@/lib/storage';
import { sendArticleNotification } from '@/lib/email';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    }

    const articles = await getArticles();
    const article = articles.find((a) => a.slug === slug);
    if (!article) {
      return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    }

    const subscribers = await getSubscribers();
    const emails = subscribers.map((s) => s.email);
    if (emails.length === 0) {
      return NextResponse.json({
        message: 'Aucun abonné',
        success: 0,
        failed: [],
      });
    }

    const { success, failed } = await sendArticleNotification(article, emails);

    return NextResponse.json({
      message: `${success} notification(s) envoyée(s)`,
      success,
      failed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
