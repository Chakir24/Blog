import { getComments } from '@/lib/storage';
import { CommentActions } from './CommentActions';

export default async function AdminCommentsPage() {
  const comments = await getComments();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold sm:text-3xl">Commentaires</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Modérez les commentaires de votre blog
      </p>

      <div className="mt-8 space-y-4 sm:mt-12">
        {comments.length === 0 ? (
          <p className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 text-center text-[var(--muted-foreground)] sm:p-12">
            Aucun commentaire pour le moment
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:p-6 ${
                !comment.approved ? 'border-amber-500/50' : ''
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {new Date(comment.date).toLocaleDateString('fr-FR')}
                    </span>
                    <a
                      href={`/articles/${comment.articleSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-[var(--accent)] hover:underline"
                    >
                      Article: {comment.articleSlug}
                    </a>
                    {!comment.approved && (
                      <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-500">
                        En attente
                      </span>
                    )}
                  </div>
                  <p className="mt-2 break-words text-[var(--muted-foreground)]">{comment.content}</p>
                </div>
                <CommentActions comment={comment} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
