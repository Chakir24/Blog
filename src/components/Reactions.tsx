'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Hand } from 'lucide-react';

type ReactionType = 'clap' | 'like' | 'bookmark';

const reactions: { type: ReactionType; icon: typeof Hand; label: string }[] = [
  { type: 'clap', icon: Hand, label: 'Applaudir' },
  { type: 'like', icon: Heart, label: 'J\'aime' },
  { type: 'bookmark', icon: Bookmark, label: 'Sauvegarder' },
];

export function Reactions({ slug }: { slug: string }) {
  void slug; // Reserved for future reaction persistence
  const [counts, setCounts] = useState({ clap: 0, like: 0, bookmark: 0 });
  const [active, setActive] = useState<ReactionType | null>(null);

  const handleReaction = (type: ReactionType) => {
    if (active === type) {
      setCounts((c) => ({ ...c, [type]: Math.max(0, c[type] - 1) }));
      setActive(null);
    } else {
      if (active) {
        setCounts((c) => ({ ...c, [active]: Math.max(0, c[active] - 1) }));
      }
      setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
      setActive(type);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {reactions.map(({ type, icon: Icon, label }) => (
        <motion.button
          key={type}
          onClick={() => handleReaction(type)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all sm:gap-2 sm:px-4 sm:py-2.5 ${
            active === type
              ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
              : 'border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]'
          }`}
          aria-label={label}
        >
          <Icon size={18} />
          {counts[type] > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="font-semibold"
            >
              {counts[type]}
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
