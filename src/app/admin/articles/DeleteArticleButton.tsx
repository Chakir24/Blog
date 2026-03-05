'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export function DeleteArticleButton({ slug }: { slug: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    const res = await fetch(`/api/articles/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-red-500/20 hover:text-red-500"
      title="Supprimer"
    >
      <Trash2 size={18} />
    </button>
  );
}
