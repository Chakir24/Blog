import type { Article, ArticleCard } from './types';
import { getArticles, getCategories } from './storage';

export async function getArticlesList(): Promise<Article[]> {
  return getArticles();
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getArticles();
  if (category === 'all') return articles;
  return articles.filter((a) => a.category === category);
}

export async function getRelatedArticles(slug: string, limit = 3): Promise<ArticleCard[]> {
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return [];

  return articles
    .filter((a) => a.slug !== slug)
    .sort((a, b) => {
      const sameCategory = a.category === article.category ? 1 : 0;
      const sameCategoryB = b.category === article.category ? 1 : 0;
      return sameCategoryB - sameCategory;
    })
    .slice(0, limit)
    .map(({ slug, title, excerpt, category, publishedAt, readingTime }) => ({
      slug,
      title,
      excerpt,
      category,
      publishedAt,
      readingTime,
    }));
}

export async function getCategoryLabel(categoryId: string): Promise<string> {
  const categories = await getCategories();
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.label ?? categoryId;
}
