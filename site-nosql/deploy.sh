#!/bin/bash

set -e

echo "Déploiement de l'application de sécurité..."

echo "Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

echo "Installation des dépendances..."
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

echo "Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Installation de PM2..."
sudo npm install -g pm2

echo "Installation de Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

cd secu/site-nosql
echo "Installation des dépendances Node.js..."
npm install

echo "Configuration de l'environnement..."
cp .env.production .env

# Configuration Nginx TEMPORAIRE (HTTP uniquement)
echo "Configuration Nginx temporaire (HTTP)..."
sudo cp nginx-temp.conf /etc/nginx/sites-available/secu.buildy-eco.fr
sudo ln -sf /etc/nginx/sites-available/secu.buildy-eco.fr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test de la configuration Nginx
sudo nginx -t

# Redémarrage de Nginx
echo "Redémarrage de Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "Démarrage de MongoDB..."
docker-compose up -d
echo "Initialisation de la base de données..."
npm run init-db

echo "Démarrage de l'application..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "Génération du certificat SSL..."
sudo certbot --nginx -d secu.buildy-eco.fr --non-interactive --agree-tos --email email@gmail.com

# Configuration Nginx FINALE (HTTPS)
echo "Configuration Nginx finale (HTTPS)..."
sudo cp nginx.conf /etc/nginx/sites-available/secu.buildy-eco.fr
sudo nginx -t
sudo systemctl reload nginx

echo "Configuration du renouvellement automatique..."
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "Déploiement terminé !"
echo "L'application est accessible sur : https://secu.buildy-eco.fr"
echo "PM2 status : pm2 status"
echo "Logs : pm2 logs secu-app" 