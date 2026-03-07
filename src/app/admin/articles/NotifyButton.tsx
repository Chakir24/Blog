'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

interface NotifyButtonProps {
  slug: string;
  title: string;
}

export function NotifyButton({ slug, title }: NotifyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (!confirm(`Envoyer une notification par email aux abonnés pour « ${title} » ?`)) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/newsletter/notify', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur');
      }

      setMessage(data.message || `${data.success} notification(s) envoyée(s)`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)] disabled:opacity-50"
        title="Notifier les abonnés"
      >
        <Mail size={18} />
      </button>
      {message && (
        <span className="text-xs text-[var(--muted-foreground)]">{message}</span>
      )}
    </div>
  );
}
