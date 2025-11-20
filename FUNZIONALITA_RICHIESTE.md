# 📋 FUNZIONALITÀ RICHIESTE

## ✅ COSA C'È GIÀ (Funziona Subito!)

### 1. **Scheda Cliente Completa** ✅
**Dove:** Menu `Clienti` → Clicca su un cliente

**Cosa vedi:**
- ✅ Totale entrate anno
- ✅ Totale uscite anno  
- ✅ Saldo anno
- ✅ Scadenze prossimi 30 giorni
- ✅ Ultimi 5 movimenti
- ✅ Tab "Flussi di cassa" con tutti i movimenti del cliente
- ✅ Grafico entrate/uscite mensili

### 2. **Gestione Entrate/Uscite** ✅
**Dove:** Menu `Flussi di Cassa`

**Puoi:**
- ✅ Registrare entrate (es. pagamenti clienti)
- ✅ Registrare uscite (es. spese studio)
- ✅ Filtrare per cliente
- ✅ Filtrare per categoria
- ✅ Vedere totali automatici
- ✅ Esportare in Excel

### 3. **Scadenze Fiscali Automatiche** ✅
- Quando crei un cliente, il sistema genera AUTOMATICAMENTE:
  - IVA mensile o trimestrale
  - IMU se ha immobili
  - Dichiarazioni redditi
  - INPS

---

## ❌ COSA MANCA (Da Aggiungere)

### 1. **Contratti/Abbonamenti** ❌

**Esempio che hai chiesto:**
> Cliente paga 1000€/anno con abbonamento

**Da implementare:**
- Tabella "Contratti"
- Importo annuale/mensile
- Data inizio/fine
- Rinnovo automatico
- Alert scadenza contratto
- Generazione automatica fatture mensili

### 2. **Fatturazione** ❌

**Cosa serve:**
- Numerazione automatica fatture
- Generazione PDF fatture
- Collegamento fattura → entrata
- Registro fatture emesse
- Fatture da incassare (scadute)

### 3. **Estratto Conto Cliente Dettagliato** ❌ (PARZIALE)

**Miglioramenti necessari:**
- ✅ GIÀ C'È: Lista entrate/uscite
- ❌ MANCA: Vista "estratto conto" in stile bancario
- ❌ MANCA: Totale "dare/avere"
- ❌ MANCA: Saldo progressivo
- ❌ MANCA: Fatture collegate
- ❌ MANCA: Conguagli da fare

### 4. **Conguagli** ❌

**Cosa serve:**
- Calcolo automatico: Fatturato VS Incassato
- Lista "da incassare"
- Avvisi conguagli
- Solleciti pagamento

### 5. **Uscite Ufficio Interne Separate** ✅ (PARZIALE)

**GIÀ PUOI:**
- Registrare movimenti senza cliente (= uscite studio)
- Filtrare per categoria (es. "Affitto Studio", "Utenze")

**MANCA:**
- Flag specifico "Spesa interna ufficio"
- Report separato uscite ufficio vs clienti

---

## 🚀 PIANO DI IMPLEMENTAZIONE

### Priorità 1 - URGENTE (Cose che ti servono subito)

1. ✅ **Estratto Conto Cliente Migliorato**
   - Vista tabellare con saldo progressivo
   - Totale dare/avere
   - Filtri per periodo

2. ✅ **Gestione Contratti Base**
   - Aggiungi contratto al cliente
   - Importo annuale/mensile
   - Data scadenza
   - Alert rinnovo

### Priorità 2 - IMPORTANTE (Entro 1-2 settimane)

3. ✅ **Fatturazione Base**
   - Crea fattura manuale
   - Numerazione automatica
   - Collegamento a cliente
   - Stato: Emessa / Pagata

4. ✅ **Report Conguagli**
   - Quanto devo incassare per cliente
   - Fatture non pagate
   - Solleciti

### Priorità 3 - NICE TO HAVE (Quando hai tempo)

5. ✅ **Generazione PDF Fatture**
6. ✅ **Rinnovo automatico contratti**
7. ✅ **Report ufficio vs clienti**

---

## 🎯 COSA FARE ADESSO

### STEP 1: Usa quello che c'è già! ✅

1. **Accedi** con: `admin` / `Admin123!`

2. **Aggiungi un cliente di prova:**
   - Menu → Clienti → Nuovo Cliente
   - Inserisci dati (anche minimi)
   - Salva

3. **Guarda la scheda cliente:**
   - Clicca sul cliente appena creato
   - Vedi le tab: Riepilogo, Flussi di cassa, Scadenze

4. **Registra movimenti:**
   - Menu → Flussi di Cassa
   - Aggiungi entrata (es. "Pagamento parcella 500€")
   - Seleziona il cliente
   - Salva

5. **Torna sulla scheda cliente:**
   - Vedrai la transazione
   - Il totale entrate sarà aggiornato!

### STEP 2: Dimmi cosa ti serve SUBITO

Delle funzionalità mancanti, quali ti servono **ORA**?

- [ ] Contratti/abbonamenti?
- [ ] Fatture?
- [ ] Estratto conto migliorato?
- [ ] Report conguagli?

**Posso implementare 1-2 funzionalità prioritarie adesso!**

---

## 💡 ESEMPIO PRATICO

### Scenario: Cliente "Mario Rossi SRL" con abbonamento 1000€/anno

**OGGI puoi fare:**

1. **Crea il cliente** "Mario Rossi SRL"

2. **Registra il pagamento annuale:**
   - Menu Cassa → Nuova Entrata
   - Importo: 1000€
   - Cliente: Mario Rossi SRL
   - Categoria: "Parcelle" o "Abbonamenti"
   - Descrizione: "Abbonamento annuale 2025"

3. **Vedi il saldo:**
   - Vai su Clienti → Mario Rossi SRL
   - Vedrai: Entrate anno: 1000€

**CON I CONTRATTI (da implementare):**

1. Crei il contratto: 1000€/anno
2. Il sistema genera AUTOMATICAMENTE:
   - 12 rate da 83,33€/mese
   - 12 scadenze
   - 12 promemoria fattura
3. Ogni mese vedi: "Da fatturare 83,33€ a Mario Rossi"

---

## ❓ DIMMI TU

**Cosa ti serve fare SUBITO?**

Rispondimi e implemento le funzionalità che ti servono di più!

