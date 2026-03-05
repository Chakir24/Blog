import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getComments } from '@/lib/storage';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleSlug = searchParams.get('articleSlug');

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'authenticated';

  let comments = await getComments();
  if (articleSlug) {
    comments = comments.filter((c) => c.articleSlug === articleSlug);
  }
  if (!isAdmin) {
    comments = comments.filter((c) => c.approved);
  }
  return NextResponse.json(comments);
}
