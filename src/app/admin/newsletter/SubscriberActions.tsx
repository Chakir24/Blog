'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface Subscriber {
  email: string;
}

export function SubscriberActions({ subscriber }: { subscriber: Subscriber }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer l'abonné ${subscriber.email} ?`)) return;
    const res = await fetch('/api/newsletter', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subscriber.email }),
      credentials: 'include',
    });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Erreur lors de la suppression');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-2 rounded-xl bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/30 sm:px-4"
      title="Supprimer"
    >
      <Trash2 size={16} />
      <span className="hidden sm:inline">Supprimer</span>
    </button>
  );
}
