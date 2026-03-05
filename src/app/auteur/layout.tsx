import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos | Réflexions et idées à travers la toile',
  description:
    "Qui se cache derrière ce blog ? Découvrez mon parcours et ce qui me pousse à partager mes idées sur le web.",
};

export default function AuteurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
