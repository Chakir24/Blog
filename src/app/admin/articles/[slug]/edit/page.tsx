import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/data';
import { ArticleForm } from '../../ArticleForm';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Modifier l&apos;article</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Modifiez &quot;{article.title}&quot;
      </p>
      <ArticleForm article={article} />
    </div>
  );
}
