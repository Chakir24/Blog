# Envoyer le projet sur GitHub

Le commit est déjà fait. Il reste à créer le dépôt sur GitHub et pousser le code.

## Étapes

### 1. Créer un dépôt sur GitHub
1. Va sur [github.com](https://github.com) et connecte-toi
2. Clique sur **+** → **New repository**
3. Nom du dépôt : `blog` (ou autre)
4. **Ne coche pas** « Initialize with README »
5. Clique sur **Create repository**

### 2. Lier et pousser
Remplace `TON_USERNAME` et `TON_REPO` par tes valeurs, puis exécute :

```bash
cd /home/tatsuya/Desktop/Project/blog
git remote add origin https://github.com/TON_USERNAME/TON_REPO.git
git push -u origin main
```

Exemple si ton compte est `manftou` et le dépôt `blog` :
```bash
git remote add origin https://github.com/manftou/blog.git
git push -u origin main
```

### 3. Authentification
Si GitHub demande une authentification :
- **Token** : utilise un [Personal Access Token](https://github.com/settings/tokens) à la place du mot de passe
- **SSH** : si tu utilises SSH, remplace l’URL par `git@github.com:TON_USERNAME/TON_REPO.git`
