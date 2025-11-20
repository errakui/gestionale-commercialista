# 📊 Gestionale per Studio Commercialista

Software gestionale completo per studi commercialisti con gestione fiscale avanzata (IVA, Ritenute d'Acconto, Servizi Predefiniti).

## ✨ Funzionalità Principali

### 🧾 Gestione Fiscale Completa
- ✅ Gestione IVA per cliente (esente, soggetto, aliquote personalizzate)
- ✅ Gestione Ritenuta d'Acconto (per liberi professionisti)
- ✅ Calcolo automatico valori fiscali nei movimenti
- ✅ Separazione spese interne studio

### 👥 Gestione Clienti
- ✅ Anagrafica completa con dati fiscali
- ✅ Storico movimenti e scadenze
- ✅ Note interne riservate
- ✅ Filtri e ricerca avanzata

### 💰 Flussi di Cassa
- ✅ Registrazione entrate/uscite
- ✅ Calcoli automatici IVA e ritenute
- ✅ Categorie personalizzabili
- ✅ Filtri per periodo, cliente, tipo

### 📅 Scadenze Fiscali
- ✅ Generazione automatica scadenze (IVA, IMU, INPS)
- ✅ Alert scadenze imminenti e arretrate
- ✅ Gestione stati (Da Fare, In Corso, Fatto)

### 🛠️ Servizi Predefiniti
- ✅ Libreria servizi riutilizzabili
- ✅ Regole fiscali predefinite
- ✅ Generazione rapida movimenti

### 📊 Dashboard Analitica
- ✅ KPI finanziari (Entrate, Uscite, Saldo)
- ✅ KPI fiscali (IVA Incassata, IVA Netto, Ritenute)
- ✅ Grafici trend ultimi 12 mesi
- ✅ Scadenze imminenti in evidenza

### 📤 Esportazioni
- ✅ Export clienti in Excel/CSV con dati fiscali
- ✅ Export movimenti con calcoli IVA/ritenute
- ✅ Export scadenze

## 🏗️ Tecnologie

### Backend
- **NestJS** - Framework Node.js enterprise
- **TypeORM** - ORM per database
- **MySQL** - Database relazionale
- **JWT** - Autenticazione sicura

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Query** - State management e cache
- **Recharts** - Grafici interattivi

## 🚀 Installazione

### Prerequisiti
- Node.js 18+ 
- MySQL 8+
- npm o yarn

### 1. Clona il Repository

```bash
git clone https://github.com/TUO_USERNAME/gestionale-commercialista.git
cd gestionale-commercialista
```

### 2. Configura il Database

```bash
# Crea database MySQL
mysql -u root -p
CREATE DATABASE gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Backend Setup

```bash
cd backend
npm install

# Crea file .env
cp .env.example .env

# Modifica .env con le tue credenziali:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=tua_password
# DB_DATABASE=gestionale_commercialista
# JWT_SECRET=tua_chiave_segreta_molto_lunga

# Esegui migrations
npm run typeorm migration:run -d src/database/data-source.ts

# Avvia backend
npm run start:dev
```

Backend disponibile su: `http://localhost:3001`

### 4. Frontend Setup

```bash
cd ../frontend
npm install

# Crea file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Avvia frontend
npm run dev
```

Frontend disponibile su: `http://localhost:3000`

## 👤 Accesso

**Username:** `admin`  
**Password:** `Admin123!`

## 📖 Utilizzo

### Creare un Cliente

1. Vai su **Clienti** → **Nuovo Cliente**
2. Compila i dati anagrafici
3. Imposta regole fiscali:
   - ☑️ Soggetto a IVA (22% default)
   - ☑️ Soggetto a Ritenuta (20% per professionisti)
4. Salva

### Creare un Servizio Predefinito

1. Vai su **Servizi**
2. Clicca **Nuovo Servizio**
3. Imposta nome, importo, regole fiscali
4. Salva

### Registrare Movimento

Il sistema calcola automaticamente:
- **Imponibile** (importo senza IVA)
- **IVA** (basata su aliquota cliente)
- **Ritenuta d'Acconto** (se applicabile)
- **Importo netto** da incassare

### Visualizzare Analisi Fiscali

Dashboard mostra in tempo reale:
- IVA Incassata (da versare allo Stato)
- IVA Versata (a credito su acquisti)
- IVA Netto (bilancio)
- Ritenute Subite (da recuperare)
- Imponibile Totale
- Spese Interne Studio

## 🌐 Deploy su Vercel

### Frontend (Next.js)

1. Vai su [vercel.com](https://vercel.com)
2. Importa repository GitHub
3. Configura:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Aggiungi variabile ambiente:
   - `NEXT_PUBLIC_API_URL` → URL del tuo backend

### Backend (NestJS)

Per il backend, considera:
- **Railway** (consigliato)
- **Heroku**
- **DigitalOcean App Platform**
- **VPS** (per più controllo)

## 📁 Struttura Progetto

```
gestionale-commercialista/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Autenticazione JWT
│   │   ├── clienti/        # Gestione clienti
│   │   ├── movimenti/      # Flussi di cassa
│   │   ├── scadenze/       # Scadenze fiscali
│   │   ├── servizi/        # Servizi predefiniti
│   │   ├── dashboard/      # Analytics
│   │   ├── export/         # Esportazioni
│   │   ├── entities/       # Entità TypeORM
│   │   └── database/       # Migrations & Seeds
│   └── package.json
├── frontend/                # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── lib/            # API & utilities
│   └── package.json
└── README.md
```

## 🔐 Sicurezza

- ✅ Autenticazione JWT
- ✅ Password hashate (bcrypt)
- ✅ Variabili ambiente per credenziali
- ✅ Validazione input (class-validator)
- ✅ CORS configurato

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch (`git checkout -b feature/nuova-funzionalita`)
3. Commit (`git commit -m 'Aggiungi nuova funzionalità'`)
4. Push (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 📧 Supporto

Per domande o problemi, apri una issue su GitHub.

## 🎯 Roadmap

- [ ] App mobile (React Native)
- [ ] Generazione PDF fatture
- [ ] Invio email automatico scadenze
- [ ] Report IVA trimestrale automatico
- [ ] Backup automatico cloud
- [ ] Multi-utente con permessi

---

**Sviluppato con ❤️ per Studi Commercialisti**
