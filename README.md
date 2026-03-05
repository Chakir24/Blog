# Building Scalable Digital Systems — Blog Premium

Blog haut de gamme, moderne et interactif inspiré de **chakir.dev** (design minimaliste) et **dyvact.com** (contenu business/tech).

## 🎨 Design

- **Mode sombre par défaut** avec toggle Light/Dark animé
- **Palette** : noir profond, blanc cassé, gris doux, accent violet/bleu
- **Typographie** : Syne (titres) + Instrument Serif (accents)
- **Animations** : Framer Motion (scroll, hover, micro-interactions)
- **Glassmorphism** léger et ombres subtiles

## ⚡ Fonctionnalités

- ✅ Hero section impactante
- ✅ Filtres dynamiques par catégorie (Dev, IA, Business, Architecture, Leadership)
- ✅ Recherche instantanée avec suggestions (Ctrl+K / Cmd+K)
- ✅ Barre de progression de lecture
- ✅ Table des matières dynamique dans les articles
- ✅ Temps de lecture estimé
- ✅ Système de réactions (clap, like, bookmark)
- ✅ Commentaires avec design propre
- ✅ Dark/Light mode toggle
- ✅ Newsletter premium
- ✅ Articles recommandés
- ✅ Page auteur avec bio et compétences

## 🛠 Stack

- **Frontend** : Next.js 16, React 19
- **Styling** : TailwindCSS v4
- **Animations** : Framer Motion
- **Markdown** : react-markdown, remark-gfm, rehype-slug

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 🔐 Administration

Accédez au tableau de bord admin : [http://localhost:3000/admin](http://localhost:3000/admin)

**Mot de passe par défaut** : `admin123`

Pour changer le mot de passe, créez un fichier `.env` :
```
ADMIN_PASSWORD=votre_mot_de_passe_securise
```

### Fonctionnalités du dashboard
- **Articles** : Créer, modifier, supprimer des articles
- **Commentaires** : Approuver, masquer ou supprimer les commentaires
- **Newsletter** : Voir la liste des abonnés

## 📁 Structure

```
src/
├── app/
│   ├── articles/[slug]/   # Page article avec TOC, réactions, commentaires
│   ├── auteur/            # Page auteur
│   ├── mentions/          # Mentions légales
│   └── confidentialite/   # Politique de confidentialité
├── components/
│   ├── Header.tsx         # Nav + recherche + theme toggle
│   ├── Hero.tsx
│   ├── ArticlesSection.tsx # Filtres + grille articles
│   ├── ArticleCard.tsx
│   ├── Expertise.tsx
│   ├── Newsletter.tsx
│   ├── Footer.tsx
│   ├── SearchModal.tsx    # Recherche avec suggestions
│   ├── ReadingProgress.tsx
│   ├── TableOfContents.tsx
│   ├── Reactions.tsx
│   └── Comments.tsx
└── lib/
    ├── data.ts           # Articles (à remplacer par API/CMS)
    └── types.ts
```

## 📝 Contenu

Les articles sont dans `src/lib/data.ts`. Pour un CMS headless ou une API Laravel :

1. Remplacer les imports dans les composants
2. Créer des routes API ou utiliser `getServerSideProps`/`generateStaticParams`

## 🔧 Configuration

- **Photo de profil** : Ajoutez votre image dans `public/profile.jpg` (format carré recommandé)
- **Newsletter** : Intégrer votre service (Mailchimp, ConvertKit, etc.) dans `Newsletter.tsx`
- **Commentaires** : Remplacer par Giscus, utterances ou votre backend
- **Réseaux sociaux** : Mettre à jour les liens dans `Footer.tsx` et `auteur/page.tsx`

## 📄 Licence

Projet personnel — à adapter selon vos besoins.
