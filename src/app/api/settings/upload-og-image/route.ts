import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { validateImageUpload } from '@/lib/file-validation';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Fichier image requis' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const validation = validateImageUpload(file, buffer);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, 'og-image.jpg');

    await mkdir(publicDir, { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: '/og-image.jpg' });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
  }
}
