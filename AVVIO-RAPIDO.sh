#!/bin/bash

echo "🚀 SETUP GESTIONALE COMMERCIALISTA"
echo "=================================="
echo ""

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Installa dipendenze
echo -e "${BLUE}📦 Step 1/5: Installazione dipendenze...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Errore installazione dipendenze${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dipendenze installate${NC}"
echo ""

# Step 2: Verifica MySQL
echo -e "${BLUE}📊 Step 2/5: Verifica MySQL...${NC}"
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL trovato${NC}"
    
    # Prova a creare il database
    echo -e "${YELLOW}Creazione database...${NC}"
    mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database creato/verificato${NC}"
    else
        echo -e "${YELLOW}⚠️  Crea manualmente il database:${NC}"
        echo "mysql -u root -p"
        echo "CREATE DATABASE gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        echo ""
        read -p "Premi INVIO dopo aver creato il database..."
    fi
else
    echo -e "${RED}❌ MySQL non trovato! Installalo prima di continuare.${NC}"
    exit 1
fi
echo ""

# Step 3: Migration database
echo -e "${BLUE}🗄️  Step 3/5: Creazione tabelle database...${NC}"
cd backend
npm run migration:run
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Errore migration database${NC}"
    echo -e "${YELLOW}Verifica username/password MySQL in backend/.env${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Tabelle create${NC}"
echo ""

# Step 4: Seed database
echo -e "${BLUE}🌱 Step 4/5: Popolamento database iniziale...${NC}"
npm run seed
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Errore seed database${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Database popolato${NC}"
echo ""

cd ..

# Step 5: Avvio applicazione
echo -e "${BLUE}🚀 Step 5/5: Avvio applicazione...${NC}"
echo ""
echo -e "${GREEN}=================================="
echo "✅ SETUP COMPLETATO!"
echo "=================================="
echo ""
echo "📱 Accedi all'applicazione:"
echo "   URL: ${BLUE}http://localhost:3000${NC}"
echo ""
echo "🔐 Credenziali:"
echo "   Username: ${YELLOW}admin${NC}"
echo "   Password: ${YELLOW}Admin123!${NC}"
echo ""
echo "Avvio in corso..."
echo -e "=================================="${NC}
echo ""

npm run dev

