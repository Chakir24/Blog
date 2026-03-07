import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
import { revalidatePath } from 'next/cache';
import { getComments, saveComments, deleteComment } from '@/lib/storage';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { approved } = await request.json();
  const comments = await getComments();
  const index = comments.findIndex((c) => c.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  comments[index].approved = approved;
  await saveComments(comments);
  revalidatePath('/admin/comments');
  revalidatePath('/articles', 'layout');
  return NextResponse.json(comments[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const comments = await getComments();
  if (!comments.some((c) => c.id === id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await deleteComment(id);
  revalidatePath('/admin/comments');
  revalidatePath('/articles', 'layout');
  return NextResponse.json({ success: true });
}
