'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok || data.message === 'Already subscribed') {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-gradient-to-br from-[var(--card)] to-[var(--glass)] p-6 backdrop-blur-xl sm:p-10 md:p-16"
        >
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
            <div className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/20 sm:mb-8 md:mb-0 md:mr-8 md:h-16 md:w-16">
              <Mail size={32} className="text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-3xl font-bold md:text-4xl">
                Restons en contact
              </h2>
              <p className="mt-3 text-base text-[var(--muted-foreground)] sm:mt-4 sm:text-lg">
                Recevez mes nouvelles réflexions par email. Pas de spam, juste des
                moments partagés de temps en temps.
              </p>

              {status === 'error' ? (
                <div className="mt-8 flex items-center gap-3 rounded-xl bg-red-500/20 p-4 text-red-500">
                  <span className="font-medium">
                    Une erreur s&apos;est produite. Réessayez plus tard.
                  </span>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="rounded-lg bg-red-500/30 px-3 py-1 text-sm hover:bg-red-500/40"
                  >
                    Réessayer
                  </button>
                </div>
              ) : status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 flex items-center gap-3 rounded-xl bg-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400"
                >
                  <Check size={24} />
                  <span className="font-medium">
                    Merci ! Vous recevrez bientôt mes prochaines nouvelles.
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-5 py-4 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition-colors focus:border-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 font-semibold text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        S&apos;inscrire
                        <ArrowRight
                          size={20}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
