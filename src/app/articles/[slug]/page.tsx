import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
import { getArticleBySlug, getRelatedArticles, getCategoryLabel } from "@/lib/data";
import { getCategories } from "@/lib/storage";
import { ArticleLayout } from "./ArticleLayout";

export async function generateStaticParams() {
  const { getArticlesList } = await import("@/lib/data");
  const articles = await getArticlesList();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Réflexions et idées à travers la toile`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, categoryLabel, categories] = await Promise.all([
    getRelatedArticles(slug),
    getCategoryLabel(article.category),
    getCategories(),
  ]);

  const categoryLabels = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  return (
    <ArticleLayout
      article={article}
      related={related}
      categoryLabel={categoryLabel}
      categoryLabels={categoryLabels}
    />
  );
}
