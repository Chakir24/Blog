import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createHash } from 'crypto';
import { getSettings, saveSettings } from '@/lib/storage';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  const salt = process.env.ADMIN_PASSWORD_SALT || 'blog-admin-salt';
  return createHash('sha256').update(password + salt).digest('hex');
}

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSettings();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- intentionally excluded from response
  const { adminPasswordHash, ...publicSettings } = settings;
  return NextResponse.json(publicSettings);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- exclude from updates
    const { adminPassword, adminPasswordHash, ...rest } = body;

    const updates: Record<string, unknown> = { ...rest };

    if (adminPassword && typeof adminPassword === 'string' && adminPassword.length >= 6) {
      updates.adminPasswordHash = hashPassword(adminPassword);
    }

    const settings = await saveSettings(updates as Parameters<typeof saveSettings>[0]);
    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');
    revalidatePath('/a-propos');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- exclude from response
    const { adminPasswordHash: _hash, ...publicSettings } = settings;
    return NextResponse.json(publicSettings);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Données invalides';
    console.error('[api/settings PUT]', err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
