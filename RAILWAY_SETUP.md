# 🚂 Configurazione Railway

## ⚠️ IMPORTANTE: Due Servizi Separati

Railway deve avere **DUE servizi separati** configurati:

1. **Backend** (NestJS)
2. **Frontend** (Next.js)

## 📋 Setup Step-by-Step

### 1. Crea il Progetto Railway

1. Vai su [railway.app](https://railway.app)
2. Crea nuovo progetto
3. Seleziona "Deploy from GitHub repo"
4. Connetti il repository GitHub

### 2. Aggiungi Servizio Backend

1. Nel progetto Railway, clicca **"+ New"** → **"GitHub Repo"**
2. Seleziona lo stesso repository
3. Nelle impostazioni del servizio:
   - **Name:** `backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Port:** Railway assegna automaticamente (usa variabile `PORT`)

### 3. Aggiungi Servizio Frontend

1. Nel progetto Railway, clicca **"+ New"** → **"GitHub Repo"**
2. Seleziona lo stesso repository
3. Nelle impostazioni del servizio:
   - **Name:** `frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Port:** Railway assegna automaticamente (usa variabile `PORT`)

### 4. Aggiungi Database PostgreSQL

1. Nel progetto Railway, clicca **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway crea automaticamente il database
3. Copia le variabili di connessione

### 5. Configura Variabili Ambiente

#### Backend Service - Variabili Ambiente:

```env
# Database (da Railway PostgreSQL service)
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_DATABASE=${PGDATABASE}

# JWT
JWT_SECRET=la_tua_chiave_segreta_molto_lunga_e_complessa

# Port (Railway assegna automaticamente)
PORT=3001
```

#### Frontend Service - Variabili Ambiente:

```env
# API URL (sostituisci con l'URL del tuo backend Railway)
NEXT_PUBLIC_API_URL=https://tuo-backend.railway.app/api

# Port (Railway assegna automaticamente)
PORT=3000
```

### 6. Configurazione Avanzata (Opzionale)

Se Railway non rileva automaticamente i Procfile, puoi configurare manualmente:

#### Backend Service Settings:
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

#### Frontend Service Settings:
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

## 🔍 Verifica Deploy

### Backend
- URL: `https://tuo-backend.railway.app`
- Health check: `https://tuo-backend.railway.app/api/health` (se implementato)
- API: `https://tuo-backend.railway.app/api`

### Frontend
- URL: `https://tuo-frontend.railway.app`
- Login: `https://tuo-frontend.railway.app/login`

## 🐛 Troubleshooting

### Errore: "Missing script: start:prod"

**Causa:** Railway sta cercando lo script nella directory root invece che in `backend/` o `frontend/`.

**Soluzione:**
1. Verifica che **Root Directory** sia impostata correttamente (`backend` o `frontend`)
2. Verifica che i Procfile esistano in `backend/Procfile` e `frontend/Procfile`
3. Se necessario, configura manualmente **Start Command** nelle impostazioni del servizio

### Errore: "Cannot find module"

**Causa:** Le dipendenze non sono installate o il build non è stato eseguito.

**Soluzione:**
1. Verifica che **Build Command** sia: `npm install && npm run build`
2. Controlla i log di build in Railway
3. Assicurati che `node_modules` non sia nel `.gitignore` (dovrebbe esserci)

### Errore: "Port already in use"

**Causa:** Il codice non usa la variabile `PORT` di Railway.

**Soluzione:**
- Backend: Verifica che `main.ts` usi `process.env.PORT || 3001`
- Frontend: Next.js usa automaticamente `PORT` se disponibile

### Database Connection Error

**Causa:** Variabili ambiente non configurate correttamente.

**Soluzione:**
1. Vai su Railway → Database → Variables
2. Copia tutte le variabili `PG*`
3. Aggiungile al servizio Backend come variabili ambiente
4. Oppure usa i reference: `${PGHOST}`, `${PGPORT}`, etc.

## 📝 Note Importanti

- **Non usare `synchronize: true` in produzione!** Usa migrations.
- Railway assegna automaticamente le porte, usa `process.env.PORT`
- I Procfile sono già configurati correttamente in `backend/Procfile` e `frontend/Procfile`
- Il file `railway.toml` nella root è stato rimosso perché Railway deve gestire due servizi separati

## ✅ Checklist Finale

- [ ] Due servizi creati (backend + frontend)
- [ ] Root Directory configurata per ogni servizio
- [ ] Database PostgreSQL aggiunto
- [ ] Variabili ambiente configurate
- [ ] Build completato con successo
- [ ] Backend risponde su `/api`
- [ ] Frontend si connette al backend
- [ ] Login funzionante

---

**Se hai ancora problemi, controlla i log in Railway Dashboard → Deployments → Logs**

