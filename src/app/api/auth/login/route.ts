import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';
import { getSettings } from '@/lib/storage';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';

const SESSION_COOKIE = 'admin_session';
const LOGIN_RATE_LIMIT = 5; // 5 attempts per minute
const LOGIN_WINDOW_MS = 60 * 1000;

function hashPassword(password: string): string {
  const salt = process.env.ADMIN_PASSWORD_SALT || 'blog-admin-salt';
  return createHash('sha256').update(password + salt).digest('hex');
}

function constantTimeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

const MAX_LOGIN_BODY = 1024; // 1 KB

export async function POST(request: Request) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_LOGIN_BODY) {
    return NextResponse.json({ success: false }, { status: 413 });
  }
  const clientId = getClientIdentifier(request);
  const limit = process.env.NODE_ENV === 'development' ? 20 : LOGIN_RATE_LIMIT;
  const { allowed } = checkRateLimit(`login:${clientId}`, limit, LOGIN_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Trop de tentatives. Réessayez dans 1 minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!password || password.length > 256) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const settings = await getSettings();
    const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const storedHash = settings.adminPasswordHash;

    // En local : ADMIN_PASSWORD prime si défini (pour éviter conflit avec hash en prod)
    const useEnvFirst = process.env.NODE_ENV === 'development' && process.env.ADMIN_PASSWORD;
    const isValid = useEnvFirst
      ? constantTimeCompare(password, envPassword)
      : storedHash
        ? constantTimeCompare(hashPassword(password), storedHash)
        : envPassword && constantTimeCompare(password, envPassword);

    if (isValid) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // lax permet l'envoi du cookie en production (navigation, liens externes)
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
