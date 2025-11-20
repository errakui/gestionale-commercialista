#!/bin/bash

echo "🚀 Avvio Gestionale Commercialista..."
echo ""

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Backend:${NC} http://localhost:3001"
echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
echo ""
echo "Premi CTRL+C per fermare l'applicazione"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev

