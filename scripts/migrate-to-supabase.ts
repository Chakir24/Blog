/**
 * Script de migration des données JSON vers Supabase.
 * Usage: npm run migrate:supabase
 *
 * Prérequis:
 * - .env.local avec NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 * - Schéma SQL exécuté dans Supabase (supabase/schema.sql)
 * - Bucket "uploads" créé dans Supabase Storage (public)
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { existsSync } from 'fs';
import { join } from 'path';

// Charger .env.local ou .env
const root = process.cwd();
if (existsSync(join(root, '.env.local'))) {
  config({ path: join(root, '.env.local') });
} else {
  config({ path: join(root, '.env') });
}

import { readFile } from 'fs/promises';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables manquantes: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const DATA_DIR = join(process.cwd(), 'data');

async function readJson<T>(file: string): Promise<T | null> {
  try {
    const data = await readFile(join(DATA_DIR, file), 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

async function main() {
  console.log('Migration des données vers Supabase...\n');

  // Articles
  const articles = await readJson<Array<Record<string, unknown>>>('articles.json');
  if (articles?.length) {
    const rows = articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      published_at: a.publishedAt,
      reading_time: a.readingTime ?? 0,
      image: a.image ?? null,
      author: a.author,
    }));
    const { error } = await supabase.from('articles').upsert(rows, { onConflict: 'slug' });
    if (error) {
      console.error('Erreur articles:', error.message);
    } else {
      console.log(`✓ ${rows.length} articles migrés`);
    }
  } else {
    console.log('Aucun article à migrer');
  }

  // Comments
  const comments = await readJson<Array<Record<string, unknown>>>('comments.json');
  if (comments?.length) {
    const rows = comments.map((c) => ({
      id: c.id,
      article_slug: c.articleSlug,
      author: c.author,
      content: c.content,
      date: c.date,
      approved: c.approved ?? false,
    }));
    const { error } = await supabase.from('comments').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Erreur commentaires:', error.message);
    } else {
      console.log(`✓ ${rows.length} commentaires migrés`);
    }
  } else {
    console.log('Aucun commentaire à migrer');
  }

  // Subscribers
  const subscribers = await readJson<Array<Record<string, unknown>>>('newsletter.json');
  if (subscribers?.length) {
    const rows = subscribers.map((s) => ({
      email: s.email,
      subscribed_at: s.subscribedAt,
    }));
    const { error } = await supabase.from('subscribers').upsert(rows, { onConflict: 'email' });
    if (error) {
      console.error('Erreur abonnés:', error.message);
    } else {
      console.log(`✓ ${rows.length} abonnés migrés`);
    }
  } else {
    console.log('Aucun abonné à migrer');
  }

  // Categories
  const categories = await readJson<Array<Record<string, unknown>>>('categories.json');
  if (categories?.length) {
    const rows = categories.map((c) => ({ id: c.id, label: c.label }));
    const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Erreur catégories:', error.message);
    } else {
      console.log(`✓ ${rows.length} catégories migrées`);
    }
  } else {
    console.log('Aucune catégorie à migrer');
  }

  // Settings
  const settings = await readJson<Record<string, unknown>>('settings.json');
  if (settings) {
    const { error } = await supabase.from('settings').upsert({ id: 1, data: settings }, { onConflict: 'id' });
    if (error) {
      console.error('Erreur paramètres:', error.message);
    } else {
      console.log('✓ Paramètres migrés');
    }
  } else {
    console.log('Aucun paramètre à migrer');
  }

  console.log('\nMigration terminée.');
}

main().catch(console.error);
