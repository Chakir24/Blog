/**
 * Diagnostic complet des fonctionnalités en production.
 * GET /api/diagnostic
 *
 * Vérifie : Supabase, variables d'env, auth, lecture, écriture.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { getArticles, getCategories, getSettings, getComments, getSubscribers } from '@/lib/storage';

export async function GET() {
  const results: Record<string, { ok: boolean; message: string; details?: unknown }> = {};
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NEWSLETTER_FROM_EMAIL: process.env.NEWSLETTER_FROM_EMAIL || 'onboarding@resend.dev',
    NODE_ENV: process.env.NODE_ENV,
  };

  // 1. Variables d'environnement
  results.env = {
    ok: env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
    message: env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
      ? 'Variables Supabase OK'
      : 'Variables manquantes (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)',
    details: env,
  };

  // 1b. Newsletter / Resend
  results.resend = {
    ok: !!env.RESEND_API_KEY,
    message: env.RESEND_API_KEY
      ? `Resend configuré (from: ${env.NEWSLETTER_FROM_EMAIL})`
      : 'RESEND_API_KEY manquant. Créez un compte sur resend.com et ajoutez la clé dans .env.local',
    details: { hasKey: env.RESEND_API_KEY, fromEmail: env.NEWSLETTER_FROM_EMAIL },
  };

  // 2. Connexion Supabase (lecture)
  try {
    const { error } = await supabase.from('articles').select('slug').limit(1);
    results.supabase = {
      ok: !error,
      message: error ? `Erreur: ${error.message}` : 'Connexion Supabase OK',
    };
  } catch (err) {
    results.supabase = {
      ok: false,
      message: err instanceof Error ? err.message : 'Erreur connexion',
    };
  }

  // 3. Auth (cookie)
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const isAuthenticated = session?.value === 'authenticated';
  results.auth = {
    ok: isAuthenticated,
    message: isAuthenticated ? 'Session admin active' : 'Non connecté (cookie admin_session absent ou invalide)',
    details: { hasCookie: !!session, cookieValue: session ? '[présent]' : '[absent]' },
  };

  // 4. Lecture des données (storage)
  const readChecks: Array<{ name: string; fn: () => Promise<unknown> }> = [
    { name: 'articles', fn: getArticles },
    { name: 'categories', fn: getCategories },
    { name: 'settings', fn: getSettings },
    { name: 'comments', fn: getComments },
    { name: 'subscribers', fn: getSubscribers },
  ];

  for (const { name, fn } of readChecks) {
    try {
      const data = await fn();
      const count = Array.isArray(data) ? data.length : data ? 1 : 0;
      results[`read_${name}`] = {
        ok: true,
        message: `OK (${count} élément${count > 1 ? 's' : ''})`,
      };
    } catch (err) {
      results[`read_${name}`] = {
        ok: false,
        message: err instanceof Error ? err.message : 'Erreur',
      };
    }
  }

  // 5. Résumé
  const allOk = Object.values(results).every((r) => r.ok);
  const critical = ['env', 'supabase', 'read_articles', 'read_categories', 'read_settings'];
  const criticalOk = critical.every((k) => results[k]?.ok);

  return NextResponse.json({
    summary: {
      allOk,
      criticalOk,
      criticalFailing: critical.filter((k) => !results[k]?.ok),
      production: process.env.NODE_ENV === 'production',
    },
    results,
    hints: {
      auth: !results.auth?.ok
        ? 'Connectez-vous via /admin/login pour tester les actions admin (articles, catégories, paramètres).'
        : null,
      env: !results.env?.ok
        ? 'Configurez les variables dans Vercel > Settings > Environment Variables.'
        : null,
      supabase: !results.supabase?.ok
        ? 'Vérifiez le schéma SQL (supabase/schema.sql) et les clés Supabase.'
        : null,
      resend: !results.resend?.ok
        ? 'Pour les notifications newsletter : créez un compte sur resend.com, récupérez la clé API, ajoutez RESEND_API_KEY et NEWSLETTER_FROM_EMAIL (ex: onboarding@resend.dev) dans .env.local'
        : null,
    },
  });
}
