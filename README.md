# 📊 Gestionale per Studio Commercialista

Software gestionale completo per studi commercialisti con gestione fiscale avanzata (IVA, Ritenute d'Acconto, Servizi Predefiniti, Mandati di Incarico).

## ✨ Funzionalità Principali

### 📄 Mandati di Incarico Professionale
- ✅ Creazione mandati con form completo
- ✅ Selezione cliente esistente o inserimento manuale
- ✅ Generazione automatica testo mandato professionale
- ✅ Anteprima in tempo reale
- ✅ Salvataggio mandati nel database
- ✅ Export PDF mandati pronti per la firma
- ✅ Lista completa mandati con filtri

### 👥 Gestione Clienti
- ✅ Anagrafica completa con dati fiscali
- ✅ Impostazioni fiscali personalizzate (IVA, Ritenuta d'Acconto)
- ✅ Storico movimenti completo
- ✅ Statistiche fiscali (Totale Imponibile, IVA, Ritenute, Saldo)
- ✅ Note interne riservate
- ✅ Export Estratto Conto (Excel/PDF)
- ✅ Filtri e ricerca avanzata

### 💰 Flussi di Cassa
- ✅ Registrazione entrate/uscite
- ✅ Calcoli automatici IVA e ritenute basati su cliente
- ✅ Spese interne studio (non collegate a clienti)
- ✅ Categorie personalizzabili
- ✅ Filtri per periodo, cliente, tipo
- ✅ Riepilogo mensile automatico

### 🛠️ Servizi Predefiniti
- ✅ Libreria servizi riutilizzabili
- ✅ Generazione rapida movimenti da servizio
- ✅ Applicazione automatica regole fiscali cliente
- ✅ Paginazione (10 servizi per pagina)
- ✅ Modifica e gestione servizi

### 📊 Dashboard Analitica
- ✅ KPI finanziari (Entrate, Uscite, Saldo Netto)
- ✅ KPI fiscali (IVA Incassata, Ritenute)
- ✅ Grafici trend ultimi 12 mesi (line chart)
- ✅ Top clienti (bar chart)
- ✅ Categorie più usate
- ✅ Proiezioni trimestrali/annuali

### ⚙️ Impostazioni Studio
- ✅ Impostazioni generali (Nome Studio, Timezone, Formato Data, Valuta)
- ✅ Salvataggio persistente nel database
- ✅ Categorie movimenti personalizzabili
- ✅ Configurazione giorni scadenze imminenti

### 📤 Esportazioni
- ✅ Export clienti in Excel/CSV con dati fiscali
- ✅ Export movimenti con calcoli IVA/ritenute
- ✅ Export estratto conto cliente singolo (Excel/PDF)
- ✅ Export mandati (PDF)

## 🏗️ Tecnologie

### Backend
- **NestJS 10.3.0** - Framework Node.js enterprise
- **TypeORM 0.3.19** - ORM per database
- **PostgreSQL (Railway)** - Database relazionale cloud
- **JWT** - Autenticazione sicura con Passport.js
- **ExcelJS** - Generazione file Excel
- **PDFKit** - Generazione PDF
- **bcrypt** - Hash password
- **class-validator** - Validazione DTO

### Frontend
- **Next.js 14** (App Router) - Framework React
- **React 18** - Libreria UI
- **TypeScript 5** - Tipizzazione statica
- **Tailwind CSS 3.3** - Utility-first CSS
- **TanStack React Query 5** - State management e cache intelligente
- **Recharts 2.10** - Grafici interattivi
- **React Hot Toast** - Notifiche toast
- **Lucide React** - Icone moderne
- **Axios** - Client HTTP con interceptors

### Database
- **PostgreSQL** su Railway
- **Indici ottimizzati** per performance
- **Connection pooling** configurato
- **SSL** per connessioni sicure

## 🚀 Installazione

### Prerequisiti
- Node.js 18+ 
- PostgreSQL (o account Railway)
- npm o yarn
- Git

### 1. Clona il Repository

```bash
git clone https://github.com/errakui/gestionale-commercialista.git
cd gestionale-commercialista
```

### 2. Configura il Database

#### Opzione A: Database Railway (Consigliato)

1. Crea account su [Railway.app](https://railway.app)
2. Crea nuovo progetto PostgreSQL
3. Copia le credenziali di connessione

#### Opzione B: PostgreSQL Locale

```bash
# Installa PostgreSQL
# Crea database
createdb gestionale_commercialista
```

### 3. Backend Setup

```bash
cd backend
npm install

# Crea file .env
cp .env.example .env

# Modifica .env con le tue credenziali:
# DB_HOST=tuo_host_railway
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=tua_password
# DB_DATABASE=railway
# JWT_SECRET=tua_chiave_segreta_molto_lunga

# Avvia backend (crea automaticamente le tabelle)
npm run start:dev
```

Backend disponibile su: `http://localhost:3001`

**Nota:** Con `synchronize: true` (solo per sviluppo), TypeORM crea automaticamente le tabelle. Per produzione, usa migrations.

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

⚠️ **Importante:** Cambia la password dopo il primo accesso!

## 📖 Utilizzo

### Creare un Cliente

1. Vai su **Clienti** → **Nuovo Cliente**
2. Compila i dati anagrafici (Nome, CF/P.IVA, Email, PEC, Indirizzo)
3. Imposta regole fiscali:
   - **Tipo IVA:** Soggetto/Esente
   - **Aliquota IVA:** (es. 22%)
   - **Ritenuta d'Acconto:** Applica/Esente
   - **Aliquota RA:** (es. 20% per professionisti)
4. Salva

### Creare un Servizio Predefinito

1. Vai su **Servizi**
2. Clicca **Nuovo Servizio**
3. Imposta nome, prezzo base, categoria, descrizione
4. Salva

### Generare Movimento da Servizio

1. Vai su **Servizi**
2. Seleziona un servizio
3. Clicca **Genera Movimento**
4. Seleziona cliente → il sistema applica automaticamente le regole fiscali del cliente
5. Modifica se necessario e salva

### Registrare Movimento Manuale

1. Vai su **Flussi di Cassa**
2. Clicca **Nuovo Movimento**
3. Seleziona tipo (Entrata/Uscita), cliente o "Studio (spesa interna)"
4. Inserisci importo lordo
5. Il sistema calcola automaticamente:
   - **Imponibile** (importo senza IVA)
   - **IVA** (basata su aliquota cliente)
   - **Ritenuta d'Acconto** (se applicabile)
   - **Importo netto** da incassare

### Creare un Mandato di Incarico

1. Vai su **Mandato** → **Nuovo Mandato**
2. Seleziona cliente esistente o inserisci manualmente
3. Compila dati mandato (Tipo contabilità, Compenso, Modalità pagamento, Servizi)
4. Clicca **Genera Mandato** → vedi anteprima
5. Clicca **Salva** → mandato salvato nel database
6. Scarica PDF quando necessario

### Visualizzare Analisi Fiscali

Dashboard mostra in tempo reale:
- **Totale Entrate** - Somma di tutte le entrate
- **Totale Uscite** - Somma di tutte le uscite
- **Saldo Netto** - Differenza entrate/uscite
- **IVA Incassata** - Totale IVA da versare allo Stato
- **Ritenute** - Totale ritenute applicate
- **Grafici** - Trend mensile e top clienti

### Export Dati

1. **Export Clienti:** Vai su **Import/Export** → Export Clienti (Excel/CSV)
2. **Export Movimenti:** Vai su **Import/Export** → Export Movimenti con filtri
3. **Estratto Conto Cliente:** Vai su **Clienti** → Dettaglio Cliente → Scarica Excel/PDF
4. **Export Mandato:** Vai su **Mandato** → Lista → Scarica PDF

## 🌐 Deploy

### Frontend (Vercel)

1. Vai su [vercel.com](https://vercel.com)
2. Importa repository GitHub
3. Configura:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Aggiungi variabile ambiente:
   - `NEXT_PUBLIC_API_URL` → URL del tuo backend Railway

### Backend (Railway)

1. Vai su [railway.app](https://railway.app)
2. Crea nuovo progetto da GitHub
3. Seleziona il repository
4. Railway rileva automaticamente NestJS
5. Aggiungi variabili ambiente dal file `.env`
6. Railway deploya automaticamente

### Database (Railway)

1. Nel progetto Railway, aggiungi servizio PostgreSQL
2. Railway fornisce automaticamente:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_DATABASE`
3. Copia queste variabili nel backend `.env`

## 📁 Struttura Progetto

```
gestionale-commercialista/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Autenticazione JWT
│   │   ├── clienti/        # Gestione clienti
│   │   ├── movimenti/      # Flussi di cassa
│   │   ├── servizi/        # Servizi predefiniti
│   │   ├── mandati/        # Mandati di incarico
│   │   ├── dashboard/      # Analytics
│   │   ├── export/         # Esportazioni (Excel/PDF)
│   │   ├── impostazioni/   # Impostazioni studio
│   │   ├── entities/       # Entità TypeORM
│   │   └── database/       # Migrations & Seeds
│   └── package.json
├── frontend/                # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── (dashboard)/ # Route protette
│   │   │   │   ├── dashboard/
│   │   │   │   ├── clienti/
│   │   │   │   ├── cassa/
│   │   │   │   ├── servizi/
│   │   │   │   ├── mandato/
│   │   │   │   ├── export/
│   │   │   │   └── impostazioni/
│   │   │   ├── login/
│   │   │   └── providers.tsx
│   │   ├── components/     # React components
│   │   └── lib/            # API & utilities
│   └── package.json
└── README.md
```

## 🔐 Sicurezza

- ✅ Autenticazione JWT con Passport.js
- ✅ Password hashate (bcrypt)
- ✅ Variabili ambiente per credenziali
- ✅ Validazione input (class-validator)
- ✅ CORS configurato
- ✅ Route protection con Guards
- ✅ SQL injection protection (TypeORM)
- ✅ SSL per database Railway

## ⚡ Performance

- ✅ React Query con cache intelligente (`staleTime`, `gcTime`)
- ✅ Indici database per query veloci
- ✅ Connection pooling PostgreSQL
- ✅ Ottimizzazioni rendering (refetchOnWindowFocus: false)
- ✅ Paginazione client-side per liste lunghe

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch (`git checkout -b feature/nuova-funzionalita`)
3. Commit (`git commit -m 'Aggiungi nuova funzionalità'`)
4. Push (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 📧 Supporto

Per domande o problemi, apri una issue su GitHub:
**https://github.com/errakui/gestionale-commercialista/issues**

## 🎯 Roadmap

- [x] ✅ Mandati di Incarico Professionale
- [x] ✅ Export PDF mandati
- [x] ✅ Ottimizzazioni performance
- [x] ✅ Spese interne studio
- [ ] App mobile (React Native)
- [ ] Generazione PDF fatture automatiche
- [ ] Invio email automatico scadenze
- [ ] Report IVA trimestrale automatico
- [ ] Backup automatico cloud
- [ ] Multi-utente con permessi
- [ ] Integrazione Fatturazione Elettronica

---

**Sviluppato con ❤️ per Studi Commercialisti**

**Repository:** https://github.com/errakui/gestionale-commercialista
