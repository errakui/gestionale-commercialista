# 📦 Guida Installazione - Gestionale Commercialista

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** 18.x o superiore ([Download](https://nodejs.org/))
- **MySQL** 8.0+ o **MariaDB** 10.6+ ([Download MySQL](https://dev.mysql.com/downloads/))
- **npm** (incluso con Node.js)

## Installazione Passo per Passo

### 1. Configura il Database

#### Avvia MySQL/MariaDB

```bash
# Su macOS con Homebrew
brew services start mysql

# Su Linux
sudo systemctl start mysql

# Su Windows
# Avvia MySQL dal pannello di controllo o dal menu Start
```

#### Crea il Database

Accedi a MySQL:

```bash
mysql -u root -p
```

Crea il database:

```sql
CREATE DATABASE gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Installa le Dipendenze

Dalla directory root del progetto:

```bash
# Installa tutte le dipendenze (backend + frontend)
npm install
```

### 3. Configura le Variabili d'Ambiente

#### Backend

Crea il file `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Modifica `backend/.env` con i tuoi dati:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tua_password_mysql
DB_DATABASE=gestionale_commercialista

# JWT Secret (IMPORTANTE: Cambia questo valore!)
JWT_SECRET=il-tuo-super-secret-jwt-molto-sicuro-cambialo-in-produzione
JWT_EXPIRES_IN=8h

# App
PORT=3001
NODE_ENV=development

# Frontend URL per CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend

Crea il file `frontend/.env.local`:

```bash
cd ../frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

### 4. Inizializza il Database

Dalla directory `backend`:

```bash
cd backend

# Installa dipendenze TypeScript globali se necessario
npm install -g ts-node

# Esegui le migration per creare le tabelle
npm run migration:run

# Popola il database con dati iniziali (utente admin, template scadenze, categorie)
npm run seed
```

✅ **Output atteso:**
```
Database connesso. Inizio seeding...
✓ Utente admin creato (username: admin, password: Admin123!)
✓ Template scadenze creati
✓ Categorie movimento create

=== SEEDING COMPLETATO ===
Username: admin
Password: Admin123!
IMPORTANTE: Cambia la password al primo accesso!
```

### 5. Avvia l'Applicazione

#### Opzione A - Avvio Completo (Consigliato)

Dalla directory root:

```bash
npm run dev
```

Questo avvierà sia il backend che il frontend contemporaneamente.

#### Opzione B - Avvio Separato

**Terminale 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminale 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Accedi all'Applicazione

Apri il browser e vai su:

```
http://localhost:3000
```

**Credenziali di default:**
- **Username:** `admin`
- **Email:** `admin@studio.it`
- **Password:** `Admin123!`

⚠️ **IMPORTANTE:** Cambia la password dopo il primo accesso!

## Verifica Installazione

Dopo l'avvio dovresti vedere:

**Backend (porta 3001):**
```
🚀 Backend avviato su http://localhost:3001
📊 API disponibili su http://localhost:3001/api
🌍 Ambiente: development
```

**Frontend (porta 3000):**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
✓ Compiled successfully
```

## Risoluzione Problemi

### Errore: "Cannot connect to database"

```bash
# Verifica che MySQL sia in esecuzione
mysql -u root -p -e "SELECT 1"

# Verifica le credenziali in backend/.env
# Assicurati che DB_PASSWORD corrisponda alla tua password MySQL
```

### Errore: "Port 3001 already in use"

```bash
# Trova il processo sulla porta 3001
lsof -ti:3001

# Termina il processo (sostituisci PID con l'ID del processo)
kill -9 PID

# Oppure cambia porta in backend/.env
PORT=3002
```

### Errore: "Module not found"

```bash
# Reinstalla le dipendenze
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

### Reset Database

Se vuoi ricominciare da zero:

```bash
# Accedi a MySQL
mysql -u root -p

# Elimina e ricrea il database
DROP DATABASE gestionale_commercialista;
CREATE DATABASE gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Riesegui migration e seed
cd backend
npm run migration:run
npm run seed
```

## Prossimi Passi

Una volta completata l'installazione:

1. ✅ Accedi con le credenziali di default
2. ✅ Cambia la password admin
3. ✅ Configura i template delle scadenze in **Impostazioni**
4. ✅ Aggiungi le categorie movimento personalizzate
5. ✅ Inizia ad aggiungere i tuoi clienti

## Supporto

Per problemi o domande:

- Controlla la [documentazione completa](README.md)
- Verifica i log del backend per errori specifici
- Assicurati che tutte le porte (3000, 3001) siano libere

## Build per Produzione

Quando sei pronto per il deployment:

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build

# Avvia in produzione
cd ../backend
npm run start:prod

cd ../frontend
npm run start
```

Per il deployment su server, consulta la sezione Deployment nel README principale.

