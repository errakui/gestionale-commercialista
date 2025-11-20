# 🚀 Guida Deploy su GitHub e Vercel

## ✅ STEP 1: Crea Repository su GitHub

### 1.1 Vai su GitHub
Apri il browser e vai su: **https://github.com/new**

### 1.2 Crea il Repository
- **Repository name:** `gestionale-commercialista` (o nome a tua scelta)
- **Description:** `Software gestionale per studi commercialisti con gestione fiscale avanzata`
- **Visibility:** 
  - ✅ **Public** (se vuoi renderlo open source)
  - ✅ **Private** (se vuoi tenerlo privato)
- ⚠️ **NON** selezionare "Add a README file"
- ⚠️ **NON** selezionare "Add .gitignore"
- ⚠️ **NON** selezionare "Choose a license"

### 1.3 Clicca "Create repository"

---

## ✅ STEP 2: Collega e Pusha il Codice

GitHub ti mostrerà delle istruzioni. **Usa queste:**

### 2.1 Copia il comando di GitHub
Dopo aver creato il repo, GitHub ti mostrerà qualcosa tipo:

```bash
git remote add origin https://github.com/TUO_USERNAME/gestionale-commercialista.git
```

### 2.2 Esegui nel Terminale

```bash
# 1. Aggiungi il remote (copia URL dal tuo GitHub!)
git remote add origin https://github.com/TUO_USERNAME/gestionale-commercialista.git

# 2. Verifica che sia stato aggiunto
git remote -v

# 3. Pusha il codice
git push -u origin main
```

Ti chiederà username e password GitHub. Se hai 2FA attivo:
- **Username:** Il tuo username GitHub
- **Password:** Usa un **Personal Access Token** (non la password!)

### 2.3 Come creare Personal Access Token (se necessario)

1. Vai su: **https://github.com/settings/tokens**
2. Clicca "Generate new token" → "Generate new token (classic)"
3. Dai un nome: `gestionale-commercialista`
4. Seleziona scopes:
   - ✅ `repo` (tutti i permessi)
5. Clicca "Generate token"
6. **COPIA IL TOKEN** (lo vedrai solo una volta!)
7. Usa il token come password quando fai `git push`

---

## ✅ STEP 3: Deploy Backend (Railway - Consigliato)

### Perché Railway?
- ✅ Deploy gratuito (500 ore/mese)
- ✅ Database MySQL incluso
- ✅ Supporto NestJS nativo
- ✅ Deploy automatico da GitHub

### 3.1 Vai su Railway
**https://railway.app/**

### 3.2 Registrati/Login
- Clicca "Start a New Project"
- Login con GitHub

### 3.3 Deploy Backend

1. **New Project** → **Deploy from GitHub repo**
2. Seleziona il tuo repository
3. Clicca su **Deploy**
4. Railway rileverà automaticamente NestJS

### 3.4 Aggiungi Database MySQL

1. Nel progetto Railway, clicca **"+ New"**
2. Seleziona **"Database"** → **"MySQL"**
3. Railway creerà automaticamente il database

### 3.5 Configura Variabili Ambiente

Clicca sul servizio backend → **Variables** → Aggiungi:

```
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USERNAME=(prendi da MySQL service)
DB_PASSWORD=(prendi da MySQL service)
DB_DATABASE=(prendi da MySQL service)
JWT_SECRET=la_tua_chiave_segreta_molto_lunga_almeno_32_caratteri
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://tuo-dominio.vercel.app
```

**Nota:** I valori DB_* li trovi nel servizio MySQL su Railway → **Connect** → Vedi credenziali

### 3.6 Configura Root Directory

1. Clicca sul servizio → **Settings**
2. **Root Directory:** `backend`
3. **Start Command:** `npm run start:prod`
4. Salva

### 3.7 Deploy
Railway farà il deploy automatico. Aspetta qualche minuto.

### 3.8 Ottieni l'URL del Backend
1. Vai su **Settings** → **Networking**
2. Clicca **Generate Domain**
3. Copia l'URL (tipo: `gestionale-backend.railway.app`)

---

## ✅ STEP 4: Deploy Frontend su Vercel

### 4.1 Vai su Vercel
**https://vercel.com/**

### 4.2 Registrati/Login
- Clicca "Sign Up" → Login con GitHub

### 4.3 Importa Progetto

1. Clicca **"Add New"** → **"Project"**
2. Seleziona il repository `gestionale-commercialista`
3. Clicca **"Import"**

### 4.4 Configura Progetto

**Framework Preset:** Next.js (auto-rilevato)

**Root Directory:** 
- Clicca **"Edit"** accanto a Root Directory
- Seleziona: `frontend`

**Build Command:** (lascia default)
```
npm run build
```

**Output Directory:** (lascia default)
```
.next
```

### 4.5 Variabili Ambiente

Clicca **"Environment Variables"** e aggiungi:

**Name:** `NEXT_PUBLIC_API_URL`  
**Value:** `https://tuo-backend.railway.app/api`

(Usa l'URL che hai copiato da Railway, aggiungendo `/api`)

### 4.6 Deploy

Clicca **"Deploy"**

Vercel farà il build e il deploy (circa 2-3 minuti).

### 4.7 Ottieni l'URL del Frontend

Vercel ti darà un URL tipo:
```
https://gestionale-commercialista.vercel.app
```

---

## ✅ STEP 5: Configura CORS sul Backend

Ora che hai l'URL di Vercel, aggiorna Railway:

1. Vai su Railway → Backend service → **Variables**
2. Modifica `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://tuo-dominio.vercel.app
   ```
3. Railway farà il redeploy automatico

---

## ✅ STEP 6: Esegui Migration Database

### Via Railway CLI (Consigliato)

```bash
# Installa Railway CLI
npm install -g @railway/cli

# Login
railway login

# Seleziona progetto
railway link

# Esegui migration
railway run npm run typeorm migration:run -d src/database/data-source.ts
```

### Alternativa: Connettiti direttamente

1. Ottieni credenziali DB da Railway
2. Usa MySQL Workbench o phpMyAdmin
3. Esegui migrations manualmente

---

## ✅ STEP 7: Test Finale

### 7.1 Apri il Frontend
Vai su: `https://tuo-dominio.vercel.app`

### 7.2 Login
- **Username:** `admin`
- **Password:** `Admin123!`

### 7.3 Crea Cliente di Test
1. Vai su **Clienti** → **Nuovo Cliente**
2. Compila i dati
3. Salva

### 7.4 Verifica Dashboard
- Vai su **Dashboard**
- Controlla che i KPI siano visualizzati

---

## 🎉 FATTO!

Il tuo gestionale è online! 🚀

**URL Frontend:** `https://tuo-dominio.vercel.app`  
**URL Backend:** `https://tuo-backend.railway.app`

---

## 🔧 Deploy Automatico (CI/CD)

Ora ogni volta che fai:

```bash
git add .
git commit -m "Nuove modifiche"
git push
```

- ✅ **Vercel** farà automaticamente il redeploy del frontend
- ✅ **Railway** farà automaticamente il redeploy del backend

---

## 📊 Monitoraggio

### Vercel
- Dashboard: https://vercel.com/dashboard
- Vedi logs, analytics, errori

### Railway
- Dashboard: https://railway.app/dashboard
- Vedi logs, metriche, database

---

## 🆘 Problemi Comuni

### Frontend non si connette al Backend
**Problema:** Errore CORS  
**Soluzione:**
1. Verifica che `FRONTEND_URL` su Railway sia corretto
2. Controlla che `NEXT_PUBLIC_API_URL` su Vercel sia corretto

### Database migration fallita
**Problema:** Tabelle non create  
**Soluzione:**
```bash
railway run npm run typeorm migration:run -d src/database/data-source.ts
```

### Login non funziona
**Problema:** Utente admin non esiste  
**Soluzione:**
1. Connettiti al database Railway
2. Esegui seed:
```sql
INSERT INTO utenti (username, password, email, ruolo) 
VALUES ('admin', '$2b$10$...hash...', 'admin@example.com', 'ADMIN');
```

---

## 🎯 Dominio Personalizzato (Opzionale)

### Su Vercel

1. Compra dominio (es. Namecheap, Google Domains)
2. Vai su Vercel → Progetto → **Settings** → **Domains**
3. Aggiungi dominio: `tuogestionale.com`
4. Configura DNS come indicato da Vercel

---

## 💰 Costi

### Piano Gratuito
- **Vercel:** Gratis (limitato a progetti hobby)
- **Railway:** $5/mese (500 ore gratis poi $0.01/ora)

### Piano a Pagamento (se necessario)
- **Vercel Pro:** $20/mese
- **Railway Pro:** $20/mese

---

## 📚 Risorse

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **NestJS Deployment:** https://docs.nestjs.com/faq/deployment
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

**Hai bisogno di aiuto?**  
Apri una issue su GitHub o contattami!

🎉 **Buon deploy!**

