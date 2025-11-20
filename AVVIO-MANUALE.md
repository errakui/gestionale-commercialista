# 🚀 AVVIO MANUALE - Gestionale Commercialista

Se lo script automatico non funziona, segui questi comandi uno per uno.

## Prerequisiti

**Verifica MySQL:**
```bash
mysql --version
```

Se non è installato:
```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt install mysql-server
sudo systemctl start mysql
```

---

## Comandi da Eseguire (copia-incolla uno alla volta)

### 1. Vai nella directory del progetto
```bash
cd "/Users/errakui/piero gestionale commrcialista"
```

### 2. Installa dipendenze
```bash
npm install
```

### 3. Crea il database MySQL

**Opzione A - Password root vuota o "root":**
```bash
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**Opzione B - Con password diversa:**
```bash
mysql -u root -p
# Inserisci la password quando richiesto, poi:
CREATE DATABASE gestionale_commercialista CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. Crea le tabelle del database
```bash
cd backend
npm run migration:run
```

### 5. Popola il database con dati iniziali
```bash
npm run seed
```

Dovresti vedere:
```
✓ Utente admin creato (username: admin, password: Admin123!)
✓ Template scadenze creati
✓ Categorie movimento create
```

### 6. Torna alla directory root e avvia
```bash
cd ..
npm run dev
```

---

## 🎉 Accesso all'Applicazione

Quando vedi:
```
🚀 Backend avviato su http://localhost:3001
ready started server on http://localhost:3000
```

Apri il browser su:
```
http://localhost:3000
```

**Credenziali:**
- Username: `admin`
- Password: `Admin123!`

---

## ⚠️ Problemi Comuni

### "Access denied for user 'root'"

La password MySQL è diversa. Modifica `backend/.env`:
```env
DB_PASSWORD=tua_password_vera
```

### "Cannot find module"

```bash
rm -rf node_modules
npm install
```

### "Port 3001 already in use"

```bash
# Trova processo sulla porta
lsof -ti:3001
# Termina il processo (sostituisci PID con numero mostrato)
kill -9 PID
```

---

## 🆘 Serve Aiuto?

1. Controlla che MySQL sia attivo: `mysql.server status`
2. Verifica credenziali in `backend/.env`
3. Leggi gli errori nel terminale

