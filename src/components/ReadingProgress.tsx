'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const { scrollTop, clientHeight } = document.documentElement;
      const articleTop = article.getBoundingClientRect().top + scrollTop;
      const articleBottom = articleTop + article.offsetHeight - clientHeight;

      if (scrollTop < articleTop) {
        setProgress(0);
      } else if (scrollTop > articleBottom) {
        setProgress(100);
      } else {
        const read = scrollTop - articleTop;
        const total = articleBottom - articleTop;
        setProgress((read / total) * 100);
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-transparent">
      <motion.div
        className="h-full bg-[var(--accent)]"
        style={{ width: `${progress}%` }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />
    </div>
  );
}
