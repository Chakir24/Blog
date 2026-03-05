import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function getArticles(): Promise<Article[]> {
  try {
    const filePath = path.join(DATA_DIR, 'articles.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveArticles(articles: Article[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'articles.json');
  await fs.writeFile(filePath, JSON.stringify(articles, null, 2), 'utf-8');
}

export interface Comment {
  id: string;
  articleSlug: string;
  author: string;
  content: string;
  date: string;
  approved: boolean;
}

export async function getComments(): Promise<Comment[]> {
  try {
    const filePath = path.join(DATA_DIR, 'comments.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveComments(comments: Comment[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'comments.json');
  await fs.writeFile(filePath, JSON.stringify(comments, null, 2), 'utf-8');
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const filePath = path.join(DATA_DIR, 'newsletter.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'newsletter.json');
  await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');
}

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
  try {
    const filePath = path.join(DATA_DIR, 'categories.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'categories.json');
  await fs.writeFile(filePath, JSON.stringify(categories, null, 2), 'utf-8');
}

export interface Settings {
  authorName: string;
  authorTitle: string;
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
  try {
    const filePath = path.join(DATA_DIR, 'settings.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const merged = { ...current, ...settings };
  const filePath = path.join(DATA_DIR, 'settings.json');
  await fs.writeFile(filePath, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}
