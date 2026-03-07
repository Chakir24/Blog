import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateImageUpload } from '@/lib/file-validation';
import { supabase, UPLOADS_BUCKET } from '@/lib/supabase';

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

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `profile-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('[upload-profile]', error);
      return NextResponse.json(
        { error: "Erreur lors de l'upload. Vérifiez que le bucket 'uploads' existe dans Supabase Storage." },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error('[upload-profile]', err);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
