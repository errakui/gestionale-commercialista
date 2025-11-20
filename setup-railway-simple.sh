#!/bin/bash

echo "=========================================="
echo "🚀 SETUP RAILWAY - VERSIONE SEMPLICE"
echo "=========================================="
echo ""

# Colori
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verifica Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Railway CLI non trovato. Installazione...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI installato${NC}"
fi

echo -e "${YELLOW}🔐 Fai login a Railway...${NC}"
railway login

echo ""
echo -e "${YELLOW}🔗 Collega il progetto Railway...${NC}"
railway link

echo ""
echo -e "${GREEN}✅ Progetto collegato!${NC}"
echo ""
echo "=========================================="
echo "📝 PASSI MANUALI DA FARE SU RAILWAY:"
echo "=========================================="
echo ""
echo "1️⃣  Aggiungi Database MySQL:"
echo "   • Vai su railway.app"
echo "   • Clicca '+ New' → 'Database' → 'Add MySQL'"
echo ""
echo "2️⃣  Configura Backend (dopo che MySQL è pronto):"
echo "   • Clicca servizio 'backend' → tab 'Variables'"
echo "   • Aggiungi queste variabili:"
echo ""
echo "   DB_HOST=mysql.railway.internal"
echo "   DB_PORT=3306"
echo "   DB_USERNAME=root"
echo "   DB_PASSWORD=(copia da MySQL service)"
echo "   DB_DATABASE=railway"
echo "   JWT_SECRET=$(openssl rand -base64 32)"
echo "   NODE_ENV=production"
echo "   PORT=3001"
echo ""
echo "3️⃣  Dopo che backend è ripartito, esegui:"
echo "   cd backend"
echo "   railway run npm run typeorm migration:run -d src/database/data-source.ts"
echo "   cd .."
echo ""
echo "4️⃣  Configura Frontend:"
echo "   • Backend → Settings → Networking → Generate Domain"
echo "   • Copia l'URL del backend"
echo "   • Frontend → Variables → Aggiungi:"
echo "   NEXT_PUBLIC_API_URL=https://[URL-BACKEND]/api"
echo ""
echo "=========================================="
echo ""
read -p "Hai completato i passi 1 e 2? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}🗄️  Esecuzione migrations...${NC}"
    cd backend
    railway run npm run typeorm migration:run -d src/database/data-source.ts
    cd ..
    echo ""
    echo -e "${GREEN}✅ Migrations eseguite!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Setup completato!${NC}"
    echo "   Controlla su railway.app che tutto funzioni"
else
    echo ""
    echo -e "${YELLOW}⚠️  Completa i passi manuali e poi riesegui lo script${NC}"
fi

echo ""

