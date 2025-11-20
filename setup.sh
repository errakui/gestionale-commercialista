#!/bin/bash

echo "🚀 Setup Gestionale Commercialista"
echo "===================================="
echo ""

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per stampare messaggi colorati
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Verifica Node.js
print_info "Verifica Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js non trovato! Installalo da https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
print_success "Node.js trovato: $NODE_VERSION"
echo ""

# 2. Verifica MySQL
print_info "Verifica MySQL..."
if ! command -v mysql &> /dev/null; then
    print_error "MySQL non trovato!"
    print_info "Installa MySQL con: brew install mysql"
    print_info "Oppure scarica da: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi
print_success "MySQL trovato"
echo ""

# 3. Richiedi password MySQL
print_info "Configurazione MySQL..."
echo -n "Inserisci la password di MySQL root (premi INVIO se vuota): "
read -s MYSQL_PASSWORD
echo ""

# Aggiorna il file .env con la password
if [ -f "backend/.env" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" backend/.env
    else
        # Linux
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_PASSWORD/" backend/.env
    fi
    print_success "File backend/.env aggiornato"
else
    print_error "File backend/.env non trovato!"
    exit 1
fi
echo ""

# 4. Crea database
print_info "Creazione database..."
if [ -z "$MYSQL_PASSWORD" ]; then
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
else
    mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
fi

if [ $? -eq 0 ]; then
    print_success "Database 'gestionale_commercialista' creato"
else
    print_error "Errore nella creazione del database"
    print_warning "Verifica la password MySQL e riprova"
    exit 1
fi
echo ""

# 5. Installa dipendenze
print_info "Installazione dipendenze (può richiedere qualche minuto)..."
npm install --silent
if [ $? -eq 0 ]; then
    print_success "Dipendenze installate"
else
    print_error "Errore nell'installazione delle dipendenze"
    exit 1
fi
echo ""

# 6. Esegui migration
print_info "Creazione tabelle database..."
cd backend
npm run migration:run
if [ $? -eq 0 ]; then
    print_success "Tabelle create"
else
    print_error "Errore nella creazione delle tabelle"
    exit 1
fi
echo ""

# 7. Esegui seed
print_info "Popolamento database con dati iniziali..."
npm run seed
if [ $? -eq 0 ]; then
    print_success "Database popolato"
else
    print_error "Errore nel popolamento del database"
    exit 1
fi
cd ..
echo ""

# 8. Setup completato
echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║   ✅  SETUP COMPLETATO CON SUCCESSO!          ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
print_success "L'applicazione è pronta all'uso!"
echo ""
echo "📝 CREDENZIALI DI ACCESSO:"
echo "   Username: admin"
echo "   Password: Admin123!"
echo ""
echo "🚀 PER AVVIARE L'APPLICAZIONE:"
echo "   npm run dev"
echo ""
echo "🌐 DOPO L'AVVIO:"
echo "   Apri il browser su: http://localhost:3000"
echo ""
print_warning "IMPORTANTE: Cambia la password admin al primo accesso!"
echo ""

