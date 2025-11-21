# 🔧 TEST COMPLETO - ISTRUZIONI STEP-BY-STEP

## 📋 PRIMA DI INIZIARE - DIAGNOSTICA:

### Apri la Console del Browser (F12 o CMD+OPTION+I)

Vai su tab **"Console"** e copia/incolla:

```javascript
localStorage.clear()
console.log('✅ localStorage pulito')
```

Premi INVIO.

---

## 🚀 PASSO 1: VAI SULLA HOMEPAGE

```
http://localhost:3000
```

**Cosa dovrebbe succedere:**
- Vieni reindirizzato a `/login`

---

## 🔑 PASSO 2: FAI IL LOGIN

Inserisci:
```
Username: admin
Password: Admin123!
```

Clicca **"Accedi"**

**APRI LA CONSOLE (F12) e controlla:**

Dovresti vedere:
```
🔐 Tentativo login...
✅ Login OK, token ricevuto
✅ Token salvato nel localStorage
🚀 Redirect alla dashboard...
```

**Se vedi errori qui, FERMATI e dimmi quale errore vedi.**

---

## 📊 PASSO 3: VERIFICA IL TOKEN

Nella Console del browser, scrivi:

```javascript
localStorage.getItem('access_token')
```

**Risultato atteso:**
Dovresti vedere una stringa tipo:
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey..."
```

**Se vedi `null`, il problema è il login.**
**Se vedi il token, il problema è altrove.**

---

## 👥 PASSO 4: VAI SU CLIENTI

Clicca **"Clienti"** nel menu laterale sinistro (sidebar scura).

**Nella Console dovresti vedere:**
```
🔑 Token aggiunto alla richiesta: /clienti
✅ Risposta OK: /clienti
```

**Se vedi:**
```
⚠️ Token mancante per richiesta: /clienti
```

**Allora il problema è che il token non c'è nel localStorage!**

**Se vedi:**
```
❌ Errore risposta: /clienti 401
🔒 401 Unauthorized - Redirect al login
```

**Allora il token c'è ma NON è valido o scaduto.**

---

## 🔍 PASSO 5: DEBUG MANUALE

Nella Console, prova a fare la chiamata manualmente:

```javascript
fetch('http://localhost:3001/api/clienti', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  }
})
.then(r => r.json())
.then(data => console.log('✅ Clienti:', data))
.catch(err => console.error('❌ Errore:', err))
```

**Cosa vedi?**

### Se vedi i clienti:
```json
[
  {"id": 3, "nome": "Mario", "cognome": "Rossi", ...},
  ...
]
```
✅ **Il backend funziona!** Il problema è React Query.

### Se vedi errore 401:
```json
{"statusCode": 401, "message": "Unauthorized"}
```
❌ **Il token non è valido!**

### Se vedi errore di rete:
```
Network Error
```
❌ **Il backend non è raggiungibile!**

---

## 🎯 IN BASE AL RISULTATO:

### ✅ **Se i clienti si vedono nel test manuale ma NON nella pagina:**

Il problema è React Query che parte troppo presto.

**Soluzione:** Ricarica la pagina Clienti (`CMD+R` o `CTRL+R`)

### ❌ **Se vedi 401 anche nel test manuale:**

Il problema è il token.

**Soluzione:** 
1. Fai logout (pulsante rosso)
2. Fai login di nuovo
3. Riprova

### ❌ **Se vedi Network Error:**

Il backend è offline.

**Soluzione:**
```bash
cd "/Users/errakui/piero gestionale commrcialista/backend"
npm run start:dev
```

---

## 📝 FAMMI SAPERE:

**Dopo aver fatto questi passi, dimmi:**

1. ✅ o ❌ Vedi il token nel localStorage?
2. ✅ o ❌ Il test manuale funziona?
3. ✅ o ❌ Vedi i clienti nella pagina?

**Copia e incolla gli errori che vedi nella Console!**

---

## 🚨 SE ANCORA NON FUNZIONA:

Riavvia tutto da zero:

```bash
# Ferma tutto
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Avvia backend
cd "/Users/errakui/piero gestionale commrcialista/backend"
npm run start:dev &

# Aspetta 10 secondi
sleep 10

# Avvia frontend
cd "/Users/errakui/piero gestionale commrcialista/frontend"
npm run dev &

# Aspetta 15 secondi
sleep 15

# Apri browser in incognito
```

Poi vai su http://localhost:3000 e fai il login.

---

## 🎯 **FAI QUESTI TEST E DIMMI I RISULTATI!**

