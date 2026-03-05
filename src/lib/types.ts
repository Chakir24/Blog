export type Category = string;

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  publishedAt: string;
  readingTime: number;
  image?: string;
  author: string;
}

export interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  publishedAt: string;
  readingTime: number;
  image?: string;
}

/** @deprecated Use getCategories() or /api/categories for dynamic categories */
export const CATEGORY_LABELS: Record<string, string> = {};
