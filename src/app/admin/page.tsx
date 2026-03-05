import Link from 'next/link';
import { FileText, MessageCircle, Mail, ArrowRight, Tags, Settings } from 'lucide-react';
import { getArticles, getComments, getSubscribers, getCategories } from '@/lib/storage';

export default async function AdminDashboardPage() {
  const [articles, comments, subscribers, categories] = await Promise.all([
    getArticles(),
    getComments(),
    getSubscribers(),
    getCategories(),
  ]);

  const pendingComments = comments.filter((c) => !c.approved).length;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold sm:text-3xl">Tableau de bord</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Vue d&apos;ensemble de votre blog
      </p>

      <div className="mt-8 grid gap-4 sm:gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/articles"
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]/30 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Articles</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold">{articles.length}</span>
              </p>
            </div>
            <FileText size={32} className="text-[var(--accent)]" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)]">
            Gérer les articles
            <ArrowRight size={16} />
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]/30 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Catégories</p>
              <p className="mt-1 font-serif text-3xl font-bold">{categories.length}</p>
            </div>
            <Tags size={32} className="text-[var(--accent)]" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)]">
            Gérer les catégories
            <ArrowRight size={16} />
          </p>
        </Link>

        <Link
          href="/admin/comments"
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]/30 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Commentaires</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold">{comments.length}</span>
                {pendingComments > 0 && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-500">
                    {pendingComments} en attente
                  </span>
                )}
              </p>
            </div>
            <MessageCircle size={32} className="text-[var(--accent)]" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)]">
            Modérer les commentaires
            <ArrowRight size={16} />
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]/30 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Paramètres</p>
              <p className="mt-1 font-serif text-3xl font-bold">—</p>
            </div>
            <Settings size={32} className="text-[var(--accent)]" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)]">
            Configurer le blog
            <ArrowRight size={16} />
          </p>
        </Link>

        <Link
          href="/admin/newsletter"
          className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]/30 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Newsletter</p>
              <p className="mt-1 font-serif text-3xl font-bold">{subscribers.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">abonnés</p>
            </div>
            <Mail size={32} className="text-[var(--accent)]" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)]">
            Voir les abonnés
            <ArrowRight size={16} />
          </p>
        </Link>
      </div>
    </div>
  );
}
