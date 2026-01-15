#!/bin/bash

echo "🚀 Haciendo reset y git pull en /var/www/homesleep.pe"
cd /var/www/homesleep.pe || exit 1

git reset --hard
git clean -fd
git pull origin main

echo "📦 Instalando dependencias..."
npm install

echo "🧹 Eliminando carpeta build..."
sudo rm -rf /var/www/homesleep.pe/build

echo "🏗️ Ejecutando build..."
npm run build

echo "🔒 Ajustando permisos..."
sudo chown -R www-data:www-data /var/www/homesleep.pe
sudo chmod -R 777 /var/www/homesleep.pe

echo "✅ ¡Despliegue completado!"
