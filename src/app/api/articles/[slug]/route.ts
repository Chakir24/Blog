import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getArticles, saveArticles } from '@/lib/storage';
import type { Article } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const article: Article = await request.json();
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  articles[index] = article;
  await saveArticles(articles);
  return NextResponse.json(article);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const articles = await getArticles();
  const filtered = articles.filter((a) => a.slug !== slug);
  if (filtered.length === articles.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await saveArticles(filtered);
  return NextResponse.json({ success: true });
}
