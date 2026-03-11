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
  const [isError, setIsError] = useState(false);

  const handleClick = async () => {
    if (!confirm(`Envoyer une notification par email aux abonnés pour « ${title} » ?`)) return;

    setLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const res = await fetch('/api/newsletter/notify', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setMessage(data.message || `${data.success} notification(s) envoyée(s)`);
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center">
      {message && (
        <span
          className={`max-w-[200px] truncate text-xs sm:max-w-none ${
            isError ? 'text-red-500' : 'text-[var(--muted-foreground)]'
          }`}
          title={message}
        >
          {message}
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="shrink-0 rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)] disabled:opacity-50"
        title="Notifier les abonnés"
      >
        <Mail size={18} />
      </button>
    </div>
  );
}
