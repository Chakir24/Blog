'use client';

import { useRouter } from 'next/navigation';
import { Check, EyeOff, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  approved: boolean;
}

export function CommentActions({ comment }: { comment: Comment }) {
  const router = useRouter();

  const handleApprove = async () => {
    await fetch(`/api/comments/${comment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true }),
      credentials: 'include',
    });
    router.refresh();
  };

  const handleReject = async () => {
    await fetch(`/api/comments/${comment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: false }),
    });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    await fetch(`/api/comments/${comment.id}`, { method: 'DELETE', credentials: 'include' });
    router.refresh();
  };

  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      {!comment.approved ? (
        <button
          onClick={handleApprove}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-500 hover:bg-emerald-500/30 sm:px-4"
          title="Approuver"
        >
          <Check size={16} />
          <span className="hidden sm:inline">Approuver</span>
        </button>
      ) : (
        <button
          onClick={handleReject}
          className="flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-2 text-sm font-semibold text-amber-500 hover:bg-amber-500/30 sm:px-4"
          title="Masquer"
        >
          <EyeOff size={16} />
          <span className="hidden sm:inline">Masquer</span>
        </button>
      )}
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 rounded-xl bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/30 sm:px-4"
        title="Supprimer"
      >
        <Trash2 size={16} />
        <span className="hidden sm:inline">Supprimer</span>
      </button>
    </div>
  );
}
