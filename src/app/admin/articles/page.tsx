import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { getArticles, getCategories } from '@/lib/storage';
import { DeleteArticleButton } from './DeleteArticleButton';
import { NotifyButton } from './NotifyButton';

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);
  const categoryLabels = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold sm:text-3xl">Articles</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Gérez les articles de votre blog
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white hover:bg-[var(--accent-hover)]"
        >
          <Plus size={20} />
          Nouvel article
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)] sm:mt-12">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--glass-border)]">
              <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">Titre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">Catégorie</th>
              <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6 sm:py-4">Lecture</th>
              <th className="px-4 py-3 text-right text-sm font-semibold sm:px-6 sm:py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr
                key={article.slug}
                className="border-b border-[var(--glass-border)] last:border-0"
              >
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <Link
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    className="font-medium hover:text-[var(--accent)]"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--muted-foreground)] sm:px-6 sm:py-4">
                  {categoryLabels[article.category] ?? article.category}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--muted-foreground)] sm:px-6 sm:py-4">
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--muted-foreground)] sm:px-6 sm:py-4">
                  {article.readingTime} min
                </td>
                <td className="px-4 py-3 text-right sm:px-6 sm:py-4">
                  <div className="flex flex-wrap justify-end items-center gap-2">
                    <NotifyButton slug={article.slug} title={article.title} />
                    <Link
                      href={`/admin/articles/${article.slug}/edit`}
                      className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]"
                      title="Modifier"
                    >
                      <Pencil size={18} />
                    </Link>
                    <DeleteArticleButton slug={article.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
