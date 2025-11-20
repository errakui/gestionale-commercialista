# 🚀 Quick Start - 3 Comandi

## Setup Automatico (Solo la prima volta)

Apri il Terminale e vai nella cartella del progetto, poi:

### 1️⃣ Rendi eseguibile lo script
```bash
chmod +x setup.sh START.sh
```

### 2️⃣ Esegui il setup automatico
```bash
./setup.sh
```

Ti chiederà la password di MySQL (se ce l'hai).
Se MySQL non ha password, premi semplicemente INVIO.

### 3️⃣ Avvia l'applicazione
```bash
./START.sh
```

Oppure:
```bash
npm run dev
```

### 4️⃣ Apri il browser
```
http://localhost:3000
```

**Credenziali:**
- Username: `admin`
- Password: `Admin123!`

---

## ⚠️ Se MySQL Non È Installato

### macOS (con Homebrew):
```bash
brew install mysql
brew services start mysql
```

### Poi:
```bash
mysql_secure_installation
```

---

## 🛑 Per Fermare l'Applicazione

Premi `CTRL + C` nel terminale

---

## 🔄 Riavvio Rapido

Ogni volta che vuoi usare l'applicazione:

```bash
./START.sh
```

Fine! 🎉

