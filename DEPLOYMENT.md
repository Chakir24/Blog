# Déploiement du blog

## Vercel (recommandé avec GitHub)

[Vercel](https://vercel.com) est le créateur de Next.js et offre un déploiement optimisé.

### Avantages
- Gratuit pour projets personnels
- Déploiement automatique à chaque `git push`
- Configuration quasi automatique pour Next.js
- CDN global et performances élevées

### ⚠️ Limitation importante : stockage

Sur Vercel, les **fonctions serverless ont un système de fichiers éphémère**. Les écritures dans le dossier `data/` (articles, commentaires, paramètres, newsletter, uploads) **ne sont pas conservées**.

- **Lecture** : OK (données du build)
- **Écriture** : perdue (nouveaux commentaires, paramètres, articles, inscriptions newsletter)

**Solutions** : migrer vers une base de données (Supabase, Turso) ou utiliser Vercel Blob/KV. Pour garder l’architecture actuelle sans migration, préférer **Railway** ou **Render**.

---

## Déploiement sur Vercel

### 1. Pousser le projet sur GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/TON_REPO.git
git push -u origin main
```

### 2. Connecter à Vercel
1. Va sur [vercel.com](https://vercel.com) et crée un compte (connexion GitHub possible)
2. **Add New** → **Project**
3. Importe ton dépôt GitHub
4. Vercel détecte Next.js : aucune config supplémentaire nécessaire
5. Clique sur **Deploy**

### 3. Variables d'environnement
Dans **Project Settings** → **Environment Variables** :

| Variable | Description |
|----------|-------------|
| `ADMIN_PASSWORD` | Mot de passe admin |
| `ADMIN_PASSWORD_SALT` | Sel pour le hachage (optionnel) |
| `NEXT_PUBLIC_SITE_URL` | URL du site (ex: https://ton-blog.vercel.app) |
| `RESEND_API_KEY` | Clé API Resend (newsletter) |
| `NEWSLETTER_FROM_EMAIL` | Email expéditeur |

### 4. Déploiement via CLI (sans GitHub)
```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

---

## Alternative : Railway (stockage persistant)

Si tu veux garder les fichiers JSON sans migrer vers une base de données :

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Connecte ton dépôt
3. Les fichiers dans `data/` sont conservés entre les déploiements

---

## Variables d'environnement (tous hébergeurs)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `ADMIN_PASSWORD` | Oui | Mot de passe du tableau de bord admin |
| `ADMIN_PASSWORD_SALT` | Non | Sel pour le hachage |
| `NEXT_PUBLIC_SITE_URL` | Recommandé | URL publique du site |
| `RESEND_API_KEY` | Pour newsletter | Clé API Resend |
| `NEWSLETTER_FROM_EMAIL` | Pour newsletter | Email expéditeur (ex: onboarding@resend.dev) |
