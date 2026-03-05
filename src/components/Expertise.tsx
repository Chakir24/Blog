'use client';

import { motion } from 'framer-motion';
import {
  PenLine,
  Coffee,
  BookOpen,
  Palette,
  Heart,
  Sparkles,
} from 'lucide-react';

const interests = [
  {
    icon: PenLine,
    title: 'Écriture',
    description: 'J\'aime mettre des mots sur ce que je ressens et ce que je pense. L\'écriture me connecte à moi-même et aux autres.',
  },
  {
    icon: Coffee,
    title: 'Les petits moments',
    description: 'Les rituels du quotidien, les pauses café, les matinées tranquilles. La vie se vit dans les détails.',
  },
  {
    icon: BookOpen,
    title: 'Lecture',
    description: 'Les livres sont mes compagnons. Ils m\'ouvrent des mondes et me font réfléchir différemment.',
  },
  {
    icon: Palette,
    title: 'Créativité',
    description: 'Dessiner, photographier, créer sans pression. Le processus compte plus que le résultat.',
  },
  {
    icon: Heart,
    title: 'Lien humain',
    description: 'Les conversations vraies, les échanges authentiques. Se connecter aux autres est ce qui me nourrit.',
  },
  {
    icon: Sparkles,
    title: 'Inspiration',
    description: 'Chercher la beauté partout. Dans la nature, l\'art, les rencontres. Rester curieuse et ouverte.',
  },
];

export function Expertise() {
  return (
    <section id="expertise" className="scroll-mt-28 border-t border-[var(--glass-border)] px-4 py-16 sm:px-6 sm:py-20 md:scroll-mt-24 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-serif text-4xl font-bold md:text-5xl">
            Ce qui me fait vibrer
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--muted-foreground)] sm:mt-4 sm:text-lg">
            Les sujets qui me tiennent à cœur et qui nourrissent mes réflexions
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interests.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-xl hover:shadow-[var(--accent)]/5 sm:p-8"
            >
              <div className="mb-4 inline-flex rounded-xl bg-[var(--accent)]/20 p-3">
                <item.icon size={24} className="text-[var(--accent)]" />
              </div>
              <h3 className="font-serif text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-[var(--muted-foreground)]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
