'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { removeArticle } from '@/app/actions/articles';

export function DeleteArticleButton({ slug }: { slug: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    try {
      await removeArticle(slug);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
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
