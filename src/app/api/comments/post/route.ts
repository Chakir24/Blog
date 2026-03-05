import { NextResponse } from 'next/server';
import { getComments, saveComments } from '@/lib/storage';
import { getArticles } from '@/lib/storage';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';
import {
  validateSlug,
  validateCommentAuthor,
  validateCommentContent,
  checkContentLength,
} from '@/lib/validation';

const COMMENT_RATE_LIMIT = 5; // 5 comments per minute per IP

export async function POST(request: Request) {
  if (!checkContentLength(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse' }, { status: 413 });
  }
  const clientId = getClientIdentifier(request);
  const { allowed } = checkRateLimit(`comment:${clientId}`, COMMENT_RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Trop de commentaires. Réessayez dans une minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const articleSlug = validateSlug(body?.articleSlug);
    const author = validateCommentAuthor(body?.author);
    const content = validateCommentContent(body?.content);

    if (!articleSlug || !author || !content) {
      return NextResponse.json({ error: 'Champs invalides ou manquants' }, { status: 400 });
    }

    // Verify article exists
    const articles = await getArticles();
    if (!articles.some((a) => a.slug === articleSlug)) {
      return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    }

    const comments = await getComments();
    const newComment = {
      id: Date.now().toString(),
      articleSlug,
      author,
      content,
      date: new Date().toISOString().split('T')[0],
      approved: false,
    };
    comments.push(newComment);
    await saveComments(comments);
    return NextResponse.json(newComment);
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
