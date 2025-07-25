#!/bin/bash

echo "Configuration du firewall..."
sudo ufw --force reset

sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow ssh
sudo ufw allow 22/tcp

sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

sudo ufw allow from 127.0.0.1 to any port 27017

sudo ufw --force enable

echo "Firewall configuré !"
echo "Règles actives :"
sudo ufw status verbose 