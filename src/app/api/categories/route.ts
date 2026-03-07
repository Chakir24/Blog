import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories, {
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
    const body = await request.json();
    const label = typeof body.label === 'string' ? body.label.trim() : '';
    if (!label) {
      return NextResponse.json({ error: 'Le libellé est requis' }, { status: 400 });
    }

    const id = slugify(label);
    if (!id) {
      return NextResponse.json({ error: 'Impossible de générer un identifiant' }, { status: 400 });
    }

    const categories = await getCategories();
    if (categories.some((c) => c.id === id)) {
      return NextResponse.json({ error: 'Cette catégorie existe déjà' }, { status: 400 });
    }

    const newCategory: Category = { id, label };
    categories.push(newCategory);
    await saveCategories(categories);
    return NextResponse.json(newCategory);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Données invalides';
    console.error('[api/categories POST]', err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const [categories, articles] = await Promise.all([
      getCategories(),
      getArticles(),
    ]);
    if (!categories.some((c) => c.id === id)) {
      return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 });
    }

    const inUse = articles.some((a) => a.category === id);
    if (inUse) {
      return NextResponse.json(
        { error: 'Impossible de supprimer : des articles utilisent cette catégorie' },
        { status: 400 }
      );
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur';
    console.error('[api/categories DELETE]', err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
