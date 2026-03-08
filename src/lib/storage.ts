import type { Article } from './types';
import { supabase } from './supabase';

// --- Articles ---

function rowToArticle(row: Record<string, unknown>): Article {
  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    category: row.category as string,
    publishedAt: row.published_at as string,
    readingTime: (row.reading_time as number) ?? 0,
    image: row.image as string | undefined,
    author: row.author as string,
  };
}

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[storage] getArticles:', error.message);
    return [];
  }
  return (data ?? []).map(rowToArticle);
}

export async function saveArticles(articles: Article[]): Promise<void> {
  const rows = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    category: a.category,
    published_at: a.publishedAt,
    reading_time: a.readingTime,
    image: a.image ?? null,
    author: a.author,
  }));

  const { error } = await supabase.from('articles').upsert(rows, {
    onConflict: 'slug',
  });

  if (error) {
    throw new Error(`Erreur lors de la sauvegarde des articles : ${error.message}`);
  }
}

export async function deleteArticle(slug: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('slug', slug);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'article : ${error.message}`);
  }
}

// --- Comments ---

export interface Comment {
  id: string;
  articleSlug: string;
  author: string;
  content: string;
  date: string;
  approved: boolean;
}

function rowToComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    articleSlug: row.article_slug as string,
    author: row.author as string,
    content: row.content as string,
    date: row.date as string,
    approved: (row.approved as boolean) ?? false,
  };
}

export async function getComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('[storage] getComments:', error.message);
    return [];
  }
  return (data ?? []).map(rowToComment);
}

export async function saveComments(comments: Comment[]): Promise<void> {
  const rows = comments.map((c) => ({
    id: c.id,
    article_slug: c.articleSlug,
    author: c.author,
    content: c.content,
    date: c.date,
    approved: c.approved,
  }));

  const { error } = await supabase.from('comments').upsert(rows, {
    onConflict: 'id',
  });

  if (error) {
    throw new Error(`Erreur lors de la sauvegarde des commentaires : ${error.message}`);
  }
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression du commentaire : ${error.message}`);
  }
}

// --- Subscribers ---

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });

  if (error) {
    console.error('[storage] getSubscribers:', error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    email: row.email,
    subscribedAt: row.subscribed_at,
  }));
}

export async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  const rows = subscribers.map((s) => ({
    email: s.email,
    subscribed_at: s.subscribedAt,
  }));

  const { error } = await supabase.from('subscribers').upsert(rows, {
    onConflict: 'email',
  });

  if (error) {
    throw new Error(`Erreur lors de la sauvegarde des abonnés : ${error.message}`);
  }
}

// --- Categories ---

export interface Category {
  id: string;
  label: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'reflexions', label: 'Réflexions' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'creativite', label: 'Créativité' },
  { id: 'culture', label: 'Culture' },
  { id: 'inspiration', label: 'Inspiration' },
];

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*');

  if (error) {
    console.error('[storage] getCategories:', error.message);
    return DEFAULT_CATEGORIES;
  }
  if (!data?.length) return DEFAULT_CATEGORIES;
  return data.map((row) => ({ id: row.id, label: row.label }));
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const rows = categories.map((c) => ({ id: c.id, label: c.label }));

  const { error } = await supabase.from('categories').upsert(rows, {
    onConflict: 'id',
  });

  if (error) {
    throw new Error(`Erreur lors de la sauvegarde des catégories : ${error.message}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression de la catégorie : ${error.message}`);
  }
}

// --- Settings ---

export interface Settings {
  authorName: string;
  authorTitle: string;
  authorBio: string;
  authorImages: string[];
  profileImage: string;
  slogan: string;
  siteName: string;
  tagline: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    gmail: string;
  };
  adminPasswordHash: string | null;
  fontPalette: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
    robots: string;
  };
  legalMentions: string;
  privacyPolicy: string;
}

const DEFAULT_SETTINGS: Settings = {
  authorName: 'Manftou Hath',
  authorTitle: 'Auteure & créatrice de contenu',
  authorBio:
    "J'aime partager mes idées à travers la toile. Ce blog est mon espace pour écrire sur ce qui me touche : réflexions de vie, créativité, petits bonheurs et tout ce qui m'inspire. Si vous êtes ici, merci de faire partie du voyage.",
  authorImages: [],
  profileImage: '/profile.jpg',
  slogan: 'Réflexions · Créativité · Inspiration',
  siteName: 'Manftou Hath',
  tagline: 'Réflexions et idées à travers la toile',
  socialLinks: {
    facebook: '',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    gmail: 'contact@example.com',
  },
  adminPasswordHash: null,
  fontPalette: 'syne',
  seo: {
    metaTitle: 'Blog | Réflexions et idées à travers la toile',
    metaDescription:
      "Un espace personnel pour partager mes réflexions, mes inspirations et tout ce qui me fait vibrer. Bienvenue dans mon coin d'Internet.",
    metaKeywords: 'blog personnel, réflexions, créativité, lifestyle, inspiration, écriture',
    ogImage: '',
    robots: 'index, follow',
  },
  legalMentions: '',
  privacyPolicy: '',
};

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .eq('id', 1)
    .single();

  if (error || !data?.data) {
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...(data.data as Record<string, unknown>) };
}

export async function saveSettings(settings: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const merged = { ...current, ...settings };

  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, data: merged }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Erreur lors de la sauvegarde des paramètres : ${error.message}`);
  }
  return merged;
}
