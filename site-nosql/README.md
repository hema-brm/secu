# Projet Sécurité Web - Injection NoSQL

## Description

Ce projet démontre une vulnérabilité d'injection NoSQL sur une application web Node.js/Express avec MongoDB, ainsi que sa correction.

## Prérequis

- Node.js
- Docker et docker-compose
- Git

## Installation en local

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd site-nosql
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créer le fichier `.env` selon votre environnement :

```env
# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/secu
MONGODB_USER=admin
MONGODB_PASSWORD=your_password
MONGODB_DATABASE=secu

# Configuration serveur
PORT=3000
NODE_ENV=development

# Clé secrète des sessions
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

## Démarrage

### 1. Lancer MongoDB

```bash
docker-compose up -d
```

### 2. Initialiser la base de données

```bash
npm run init-db
```

Cette commande crée automatiquement les utilisateurs de test :
- admin / adminpass (admin@test.com)
- user1 / password123 (user1@test.com)
- test / testpass (test@test.com)

### 3. Lancer l'application

#### Version vulnérable (pour tester l'injection)

```bash
npm start
```

#### Version sécurisée (avec remédiation)

```bash
npm run start:secure
```

### 4. Accéder à l'application

- URL principale : http://localhost:3000
- Page de connexion : http://localhost:3000/auth/login
- Page d'inscription : http://localhost:3000/auth/register

## Test de la vulnérabilité

### Connexion normale

- Nom d'utilisateur : admin
- Mot de passe : adminpass

### Exploitation de l'injection NoSQL

- Nom d'utilisateur : admin
- Mot de passe : {"$ne": null}

Résultat : Connexion réussie malgré un mot de passe incorrect.

### Test de la version sécurisée

Avec la même attaque sur la version sécurisée, la connexion échoue car les types sont validés.

## Scripts disponibles

### Application

```bash
npm start              # Lance la version vulnérable
npm run start:secure   # Lance la version sécurisée
npm run dev            # Lance avec nodemon (vulnérable)
npm run dev:secure     # Lance avec nodemon (sécurisé)
```

### Gestion de la base de données

```bash
npm run init-db        # Crée les utilisateurs
npm run reset-db       # Supprime tout et recrée les utilisateurs
npm run list-users     # Affiche tous les utilisateurs
```

## Déploiement en production

### 1. Préparation du serveur

Installer Node.js, Docker et docker-compose sur le VPS.

### 2. Configuration

```bash
git clone <url-du-repo>
cd site-nosql
npm install
cp env.example .env
# Modifier .env avec les vraies valeurs
```

### 3. Base de données

```bash
docker-compose up -d
npm run init-db
```

### 4. Application

```bash
NODE_ENV=production node app.js
```

Ou avec PM2 :

```bash
npm install -g pm2
pm2 start app.js
```

### 5. Configuration Nginx

Créer un fichier de configuration Nginx :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Certificat SSL

```bash
sudo certbot --nginx -d votre-domaine.com
```

## Vulnérabilités et remédiations

### Vulnérabilités présentes (version vulnérable)

- Injection NoSQL sur l'authentification
- Absence de validation des types d'entrée
- Pas de nettoyage des données utilisateur
- Configuration en dur dans le code

### Remédiations implémentées (version sécurisée)

- Validation stricte des types (string uniquement)
- Nettoyage et validation des entrées
- Validation email avec regex
- Gestion des erreurs de duplication
- Variables d'environnement pour les configurations sensibles
- Sessions sécurisées

## Sécurité

Ce projet est conçu à des fins éducatives pour démontrer les vulnérabilités web et leurs remédiations. Ne pas utiliser en production sans modifications appropriées.

## Auteur

Étudiant en Sécurité Web - ESGI 