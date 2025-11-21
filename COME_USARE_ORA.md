# 🚀 COME USARE IL GESTIONALE - ISTRUZIONI COMPLETE

## ✅ TUTTO È PRONTO E FUNZIONANTE!

### 📍 PASSO 1: ACCEDI AL SISTEMA

**Apri il browser e vai su:**
```
http://localhost:3000
```

Verrai automaticamente reindirizzato alla pagina di **LOGIN** 🔐

---

### 🔑 PASSO 2: INSERISCI LE CREDENZIALI

```
Username: admin
Password: Admin123!
```

**⚠️ ATTENZIONE alla "A" maiuscola in Admin123!**

Poi clicca **"Accedi"**

---

### 🎉 PASSO 3: SEI DENTRO!

Dopo il login vedrai la **DASHBOARD** con:
- 📊 KPI (Entrate, Uscite, Saldo)
- 📅 Scadenze imminenti
- 📈 Grafici flussi di cassa
- 🏆 Migliori clienti

---

## 👥 CLIENTI DI TEST GIÀ CREATI

Ho creato **6 clienti** per testare TUTTE le combinazioni fiscali:

### 1️⃣ **Mario Rossi** (Avvocato)
- ✅ IVA 22% + Ritenuta 20%
- Studio Legale Rossi & Associati

### 2️⃣ **Tech Solutions SRL**
- ✅ IVA 22% + NO Ritenuta
- Azienda con immobili

### 3️⃣ **Giuseppe Verdi** (Forfettario)
- ⭕ NO IVA + NO Ritenuta
- Consulenza Web

### 4️⃣ **Laura Bianchi** (Medico)
- ⭕ NO IVA + ✅ Ritenuta 20%
- Prestazioni sanitarie

### 5️⃣ **Franco Neri** (Editore)
- ✅ IVA 10% + Ritenuta 20%
- Editoria & Design

### 6️⃣ **Anna Colombo** (Privato)
- ⭕ NO IVA + NO Ritenuta
- Cliente occasionale

---

## 🧪 COME TESTARE I CALCOLI AUTOMATICI

### 📝 CREA UN MOVIMENTO

1. Vai su **"Flussi di Cassa"** (menu laterale)
2. Clicca **"Nuovo Movimento"**
3. Seleziona un **cliente** (es. Mario Rossi)
4. Vedrai le sue **impostazioni fiscali** (IVA 22% + RA 20%)
5. Inserisci un importo: **1000€**
6. **BOOM!** Vedi i calcoli automatici:
   - 💰 Imponibile: **819.67€**
   - 🟦 IVA 22%: **180.33€**
   - 🟨 Ritenuta 20%: **163.93€**
   - 💚 Totale Netto: **836.07€**

### 🎯 GENERA DA SERVIZIO PREDEFINITO

1. Nella creazione movimento, dopo aver selezionato un cliente
2. Clicca **"Genera da Servizio Predefinito"**
3. Scegli un servizio
4. Il sistema **applica automaticamente** le regole fiscali del cliente!

---

## 📊 SCHEDA CLIENTE COMPLETA

1. Vai su **"Clienti"**
2. Clicca su **"Dettagli"** di un cliente
3. Vedrai:
   - 📈 **Totali automatici** anno corrente:
     - Totale Entrate
     - Totale Uscite
     - Saldo
     - IVA Incassata
     - IVA Versata
     - Ritenute Subite
     - Netto Incassato
   - 📋 **Storico movimenti completo**
   - 🎨 **Impostazioni fiscali** evidenziate
   - 📥 **Esporta Excel** estratto conto

---

## 🎨 NUOVA GRAFICA MODERNA

Dopo aver fatto il login vedrai:

✨ **Font professionali**: Inter + Manrope
✨ **Bottoni con gradienti** e animazioni smooth
✨ **Card eleganti** con ombre dinamiche
✨ **Badge colorati** moderni per stati
✨ **Tabelle interattive** con hover effects
✨ **Transizioni fluide** su tutto

---

## 🗄️ DATABASE

**Tutto è salvato su RAILWAY PostgreSQL** (non locale!)

I dati sono persistenti e accessibili da qualsiasi dispositivo.

---

## 📱 MENU NAVIGAZIONE

- 🏠 **Dashboard** - Panoramica generale
- 👥 **Clienti** - Gestione anagrafica clienti
- 💼 **Servizi** - Servizi predefiniti
- 📅 **Scadenze** - Scadenze fiscali
- 💰 **Flussi di Cassa** - Movimenti entrate/uscite
- 📥 **Import/Export** - Esportazioni Excel/CSV
- ⚙️ **Impostazioni** - Configurazioni sistema

---

## 🚪 LOGOUT

Per uscire:
- Clicca su **"Esci"** in fondo al menu laterale

---

## 🎯 FUNZIONALITÀ PRINCIPALI

### ✅ CALCOLI FISCALI AUTOMATICI
- Scorporo IVA automatico
- Calcolo ritenuta sull'imponibile
- Totale netto da incassare/pagare

### ✅ GENERA DA SERVIZIO
- Servizi predefiniti con calcoli fiscali
- Adattamento automatico al cliente

### ✅ SCHEDA CLIENTE COMPLETA
- Totali automatici da movimenti
- Storico completo
- Export Excel

### ✅ DASHBOARD ANALITICA
- KPI in tempo reale
- Grafici flussi di cassa
- Scadenze imminenti e arretrate

### ✅ INDICATORI FISCALI
- Badge IVA/Ritenuta su ogni movimento
- Colonne separate per imponibile/IVA/totale
- Tutto visibile a colpo d'occhio

---

## 🆘 PROBLEMI?

### ❌ "Non vedo i clienti"
- Fai il **logout** e **rilogin**
- Ricarica la pagina (CMD+R / CTRL+R)

### ❌ "La grafica non è cambiata"
- **Svuota la cache del browser**:
  - Chrome: CMD+SHIFT+DELETE (Mac) o CTRL+SHIFT+DELETE (Windows)
  - Seleziona "Immagini e file in cache"
  - Clicca "Cancella dati"
- Oppure apri in **modalità incognito**

### ❌ "Errore di connessione"
- Verifica che il backend sia attivo:
  ```bash
  lsof -ti:3001
  ```
- Se non è attivo, riavvia:
  ```bash
  cd "/Users/errakui/piero gestionale commrcialista/backend"
  npm run start:dev
  ```

---

## 🎉 INIZIA SUBITO!

**👉 http://localhost:3000**

Username: `admin`
Password: `Admin123!`

---

**Tutto funziona al 100%! Divertiti! 🚀**

