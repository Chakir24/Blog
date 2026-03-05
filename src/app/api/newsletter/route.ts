import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSubscribers, saveSubscribers } from '@/lib/storage';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';
import { validateEmail, checkContentLength } from '@/lib/validation';

const SUBSCRIBE_RATE_LIMIT = 3; // 3 subscriptions per minute per IP

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscribers = await getSubscribers();
  return NextResponse.json(subscribers);
}

export async function POST(request: Request) {
  if (!checkContentLength(request)) {
    return NextResponse.json({ error: 'Requête trop volumineuse' }, { status: 413 });
  }
  const clientId = getClientIdentifier(request);
  const { allowed } = checkRateLimit(`newsletter:${clientId}`, SUBSCRIBE_RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Trop de demandes. Réessayez dans une minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const email = validateEmail(body?.email);
    if (!email) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const subscribers = await getSubscribers();
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json({ message: 'Already subscribed' });
    }

    subscribers.push({
      email,
      subscribedAt: new Date().toISOString().split('T')[0],
    });
    await saveSubscribers(subscribers);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
