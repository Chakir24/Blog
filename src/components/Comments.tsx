'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export function Comments({ slug }: { slug: string }) {
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?articleSlug=${slug}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;
    setSubmitting(true);
    setSubmitSuccess(false);
    try {
      const res = await fetch('/api/comments/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug: slug, author: author.trim(), content: comment.trim() }),
      });
      if (res.ok) {
        setComment('');
        setAuthor('');
        setSubmitSuccess(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:p-6 md:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20">
          <MessageCircle size={20} className="text-[var(--accent)]" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold sm:text-xl">Commentaires</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            {loading ? '...' : `${comments.length} commentaire${comments.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {submitSuccess && (
        <div className="mb-6 rounded-xl bg-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400">
          Merci ! Votre commentaire sera visible après modération.
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
        <input
          type="text"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
            setSubmitSuccess(false);
          }}
          placeholder="Votre nom"
          required
          className="mb-3 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition-colors focus:border-[var(--accent)]"
        />
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setSubmitSuccess(false);
          }}
          placeholder="Partagez votre réflexion..."
          rows={3}
          className="w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition-colors focus:border-[var(--accent)]"
        />
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          <Send size={18} />
          {submitting ? 'Publication...' : 'Publier'}
        </motion.button>
      </form>

      <div className="space-y-6">
        {comments.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">{c.author}</span>
              <span className="text-sm text-[var(--muted-foreground)]">
                {new Date(c.date).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <p className="text-[var(--muted-foreground)]">{c.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
