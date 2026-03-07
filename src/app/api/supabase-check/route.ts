/**
 * Route de diagnostic Supabase - à supprimer en production.
 * GET /api/supabase-check pour vérifier la connexion et les tables.
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const [articlesRes, categoriesRes, settingsRes] = await Promise.all([
      supabase.from('articles').select('slug').limit(1),
      supabase.from('categories').select('id').limit(1),
      supabase.from('settings').select('id').eq('id', 1).single(),
    ]);

    const errors: string[] = [];
    if (articlesRes.error) errors.push(`articles: ${articlesRes.error.message}`);
    if (categoriesRes.error) errors.push(`categories: ${categoriesRes.error.message}`);
    if (settingsRes.error && settingsRes.error.code !== 'PGRST116')
      errors.push(`settings: ${settingsRes.error.message}`);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Erreurs Supabase',
          errors,
          hint: "Vérifiez que le schéma SQL (supabase/schema.sql) a été exécuté dans l'éditeur SQL de Supabase.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Connexion Supabase OK',
      tables: { articles: 'OK', categories: 'OK', settings: 'OK' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json(
      { ok: false, message: msg, hint: 'Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local' },
      { status: 500 }
    );
  }
}
