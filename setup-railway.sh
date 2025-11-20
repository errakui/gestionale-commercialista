#!/bin/bash

echo "🚀 Setup Automatico Railway - Gestionale Commercialista"
echo "=========================================================="
echo ""

# Verifica Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 Installazione Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Login a Railway..."
railway login

echo ""
echo "🔗 Collegamento al progetto..."
railway link

echo ""
echo "📊 Creazione Database MySQL..."
railway add --database mysql

echo ""
echo "⏳ Aspetto che il database sia pronto (30 secondi)..."
sleep 30

echo ""
echo "🔧 Configurazione variabili ambiente Backend..."

# Ottieni le credenziali MySQL
MYSQL_HOST=$(railway variables --service mysql | grep MYSQLHOST | awk '{print $2}')
MYSQL_USER=$(railway variables --service mysql | grep MYSQLUSER | awk '{print $2}')
MYSQL_PASSWORD=$(railway variables --service mysql | grep MYSQLPASSWORD | awk '{print $2}')
MYSQL_DATABASE=$(railway variables --service mysql | grep MYSQLDATABASE | awk '{print $2}')

# Genera JWT Secret random
JWT_SECRET=$(openssl rand -base64 32)

echo "Configurazione Backend..."
railway variables --service backend set DB_HOST=mysql.railway.internal
railway variables --service backend set DB_PORT=3306
railway variables --service backend set DB_USERNAME=$MYSQL_USER
railway variables --service backend set DB_PASSWORD=$MYSQL_PASSWORD
railway variables --service backend set DB_DATABASE=$MYSQL_DATABASE
railway variables --service backend set JWT_SECRET=$JWT_SECRET
railway variables --service backend set NODE_ENV=production
railway variables --service backend set PORT=3001

echo ""
echo "⏳ Aspetto che il backend riparta (30 secondi)..."
sleep 30

echo ""
echo "🗄️  Esecuzione migrations database..."
cd backend
railway run npm run typeorm migration:run -d src/database/data-source.ts
cd ..

echo ""
echo "📍 Ottengo URL del backend..."
BACKEND_URL=$(railway status --service backend --json | grep domain | awk -F'"' '{print $4}')

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Genera manualmente il dominio del backend:"
    echo "   Railway → backend → Settings → Networking → Generate Domain"
    read -p "Inserisci l'URL del backend (es: backend-xxx.railway.app): " BACKEND_URL
fi

echo ""
echo "🔧 Configurazione variabili Frontend..."
railway variables --service frontend set NEXT_PUBLIC_API_URL=https://$BACKEND_URL/api

echo ""
echo "✅ Setup completato!"
echo ""
echo "📊 Riepilogo:"
echo "   Backend URL: https://$BACKEND_URL"
echo "   Frontend URL: (controlla su Railway)"
echo "   Database: MySQL configurato"
echo ""
echo "🎉 Il deploy è completo!"
echo "   Aspetta 2-3 minuti per il rebuild automatico"
echo ""

