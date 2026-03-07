'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center max-w-md">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="font-serif text-xl font-bold">Une erreur est survenue</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Réessayez ou retournez au tableau de bord. Si le problème persiste, vérifiez les variables
          d&apos;environnement sur Vercel (Supabase, etc.).
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-[var(--accent)] px-6 py-2 font-semibold text-white hover:bg-[var(--accent-hover)]"
          >
            Réessayer
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] px-6 py-2 font-semibold hover:bg-[var(--glass)]"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </div>
    </div>
  );
}
