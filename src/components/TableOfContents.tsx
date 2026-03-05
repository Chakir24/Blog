'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    let disconnect: (() => void) | undefined;

    const timeout = setTimeout(() => {
      const article = document.querySelector('article');
      if (!article) return;

      const elements = article.querySelectorAll('h2[id], h3[id]');
      const items: Heading[] = Array.from(elements)
        .filter((el) => el.id && el.id.trim() !== '')
        .map((el) => ({
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName.charAt(1), 10),
        }));
      setHeadings(items);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && (entry.target as HTMLElement).id) {
              setActiveId((entry.target as HTMLElement).id);
            }
          });
        },
        { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
      );
      elements.forEach((el) => el.id && observer.observe(el));
      disconnect = () => observer.disconnect();
    }, 300);

    return () => {
      clearTimeout(timeout);
      disconnect?.();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-sm backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/20">
            <List size={16} className="text-[var(--accent)]" />
          </div>
          <h4 className="font-serif text-sm font-semibold tracking-tight text-[var(--foreground)]">
            Sommaire
          </h4>
        </div>
        <ul className="space-y-0.5">
          {headings.map((h, i) => {
            const isActive = activeId === h.id;
            const indent = (h.level - 2) * 14;
            return (
              <li
                key={h.id || `heading-${i}`}
                className="relative"
              >
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(h.id);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.pushState(null, '', `#${h.id}`);
                    }
                  }}
                  className={`group relative flex items-center gap-2 rounded-lg py-2 pl-3 pr-2 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--accent)]/10 font-medium text-[var(--accent)]'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--glass)] hover:text-[var(--foreground)]'
                  }`}
                  style={{ paddingLeft: indent + 12 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="toc-active"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[var(--accent)]"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                  <span className="relative truncate">{h.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
