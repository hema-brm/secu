# Commandes pour configurer HTTPS avec Nginx et Let’s Encrypt

## 1. Installer Nginx et Certbot

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

## 2. Configurer le serveur Nginx

Créer un fichier de configuration pour ton site dans `/etc/nginx/sites-available/monprojet` :

```
server {
    listen 80;
    server_name ton-domaine.fr;
    root /var/www/monprojet;
    index index.html index.htm;
}
```

Activer le site :
```bash
sudo ln -s /etc/nginx/sites-available/monprojet /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 3. Obtenir le certificat Let’s Encrypt

```bash
sudo certbot --nginx -d ton-domaine.fr
```

Suivre les instructions pour générer le certificat.

## 4. Redirection HTTP → HTTPS

Certbot peut le faire automatiquement, sinon ajoute dans la config Nginx :

```
server {
    listen 80;
    server_name ton-domaine.fr;
    return 301 https://$host$request_uri;
}
```

## 5. Vérification

- Accéder à https://ton-domaine.fr et vérifier le cadenas dans le navigateur.
- Tester la redirection depuis http://ton-domaine.fr 