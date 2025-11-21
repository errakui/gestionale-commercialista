# 🧪 CLIENTI DI TEST - Tutti i Casi Fiscali

## 📋 Come Aggiungere i Clienti

Vai su **http://localhost:3000/clienti** e clicca **"Nuovo Cliente"**

Copia e incolla i dati di ogni cliente nel form:

---

## ✅ CLIENTE 1: Mario Rossi (Avvocato)
**CASO: IVA 22% + RITENUTA 20%**

```
Tipo Cliente: Libero Professionista
Ragione Sociale: Studio Legale Rossi & Associati
Nome: Mario
Cognome: Rossi
Codice Fiscale: RSSMRA80A01H501U
Partita IVA: 12345678901
Email: mario.rossi@studiolegalerosi.it
Telefono: 02 1234567
Indirizzo: Via Roma 123
CAP: 20121
Città: Milano
Provincia: MI
Regime Fiscale: Regime Ordinario
Periodicità IVA: Mensile
Ha Immobili: NO

☑️ Soggetto a IVA
☐ Esente IVA
Aliquota IVA: 22

☑️ Soggetto a Ritenuta
☐ Esente Ritenuta
Aliquota Ritenuta: 20

☑️ Cliente Attivo

Note: Avvocato con IVA 22% e Ritenuta 20%. Cliente principale.
```

---

## ✅ CLIENTE 2: Tech Solutions SRL
**CASO: IVA 22% + NO RITENUTA**

```
Tipo Cliente: SRL
Ragione Sociale: Tech Solutions SRL
Codice Fiscale: 12345678901
Partita IVA: 98765432109
Email: info@techsolutions.it
Telefono: 02 9876543
Indirizzo: Via Milano 456
CAP: 20100
Città: Milano
Provincia: MI
Regime Fiscale: Regime Ordinario
Periodicità IVA: Trimestrale
Ha Immobili: SÌ

☑️ Soggetto a IVA
☐ Esente IVA
Aliquota IVA: 22

☐ Soggetto a Ritenuta
☑️ Esente Ritenuta

☑️ Cliente Attivo

Note: Società SRL con IVA 22% ma esente da ritenuta. Possiede immobili.
```

---

## ✅ CLIENTE 3: Giuseppe Verdi (Forfettario)
**CASO: NO IVA + NO RITENUTA**

```
Tipo Cliente: Ditta Individuale
Ragione Sociale: Consulenza Web di Giuseppe Verdi
Nome: Giuseppe
Cognome: Verdi
Codice Fiscale: VRDGPP85M15F205Z
Partita IVA: 11223344556
Email: giuseppe.verdi@consulenzaweb.it
Telefono: 347 1234567
Indirizzo: Via Verdi 78
CAP: 00100
Città: Roma
Provincia: RM
Regime Fiscale: Regime Forfettario
Periodicità IVA: Nessuna
Ha Immobili: NO

☐ Soggetto a IVA
☑️ Esente IVA

☐ Soggetto a Ritenuta
☑️ Esente Ritenuta

☑️ Cliente Attivo

Note: Regime Forfettario - Nessuna IVA, nessuna ritenuta. Importi fissi.
```

---

## ✅ CLIENTE 4: Laura Bianchi (Medico)
**CASO: NO IVA + RITENUTA 20%**

```
Tipo Cliente: Libero Professionista
Nome: Laura
Cognome: Bianchi
Codice Fiscale: BNCLAR75D45H501X
Partita IVA: 55667788990
Email: laura.bianchi@medico.it
Telefono: 333 7654321
Indirizzo: Piazza Duomo 5
CAP: 20122
Città: Milano
Provincia: MI
Regime Fiscale: Regime Ordinario
Periodicità IVA: Nessuna
Ha Immobili: NO

☐ Soggetto a IVA
☑️ Esente IVA

☑️ Soggetto a Ritenuta
☐ Esente Ritenuta
Aliquota Ritenuta: 20

☑️ Cliente Attivo

Note: Medico - Esente IVA art.10 ma con Ritenuta 20% su prestazioni sanitarie.
```

---

## ✅ CLIENTE 5: Franco Neri (Editore)
**CASO: IVA 10% + RITENUTA 20%**

```
Tipo Cliente: Ditta Individuale
Ragione Sociale: Editoria & Design di Franco Neri
Nome: Franco
Cognome: Neri
Codice Fiscale: NREFNC70T20L219W
Partita IVA: 99887766554
Email: franco.neri@editoria.it
Telefono: 02 5556677
Indirizzo: Corso Italia 99
CAP: 20135
Città: Milano
Provincia: MI
Regime Fiscale: Regime Ordinario
Periodicità IVA: Mensile
Ha Immobili: NO

☑️ Soggetto a IVA
☐ Esente IVA
Aliquota IVA: 10

☑️ Soggetto a Ritenuta
☐ Esente Ritenuta
Aliquota Ritenuta: 20

☑️ Cliente Attivo

Note: Editore con IVA RIDOTTA 10% + Ritenuta 20% su servizi editoriali.
```

---

## ✅ CLIENTE 6: Anna Colombo (Privato)
**CASO: NO IVA + NO RITENUTA**

```
Tipo Cliente: Privato
Nome: Anna
Cognome: Colombo
Codice Fiscale: CLMNNA82S50F205L
Email: anna.colombo@email.it
Telefono: 340 9988776
Indirizzo: Via dei Fiori 12
CAP: 00187
Città: Roma
Provincia: RM
Regime Fiscale: Nessuno
Periodicità IVA: Nessuna
Ha Immobili: NO

☐ Soggetto a IVA
☑️ Esente IVA

☐ Soggetto a Ritenuta
☑️ Esente Ritenuta

☑️ Cliente Attivo

Note: Cliente privato - Occasionale, senza P.IVA. Nessuna IVA e nessuna ritenuta.
```

---

## 🧪 Come Testare

Dopo aver creato i clienti:

1. **Vai su Flussi di Cassa** → Nuovo Movimento
2. **Seleziona un cliente** → Vedrai le sue impostazioni fiscali
3. **Inserisci un importo** (es. 1000€) → Vedrai i calcoli automatici:
   - Cliente Rossi (IVA 22% + RA 20%): Imponibile 819.67€ + IVA 180.33€ - Ritenuta 163.93€
   - Cliente Tech SRL (IVA 22%): Imponibile 819.67€ + IVA 180.33€
   - Cliente Verdi (Forfettario): Tutto 1000€ fisso
   - Cliente Bianchi (Medico): Imponibile 1000€ - Ritenuta 200€
   - Cliente Neri (Editore IVA 10%): Imponibile 909.09€ + IVA 90.91€ - Ritenuta 181.82€
   - Cliente Colombo (Privato): Tutto 1000€ fisso

## 🎨 NUOVA GRAFICA

Dopo aver creato i clienti, **RICARICA LA PAGINA** (CMD+R / CTRL+R) per vedere:

✨ **Font professionali** (Inter + Manrope)
✨ **Grafica moderna** con gradienti e ombre
✨ **Bottoni animati** con effetto hover
✨ **Card eleganti** con transizioni fluide
✨ **Badge colorati** per stati e categorie
✨ **Tabelle moderne** con hover effects

---

## 🚀 Prova Subito!

**http://localhost:3000/clienti/nuovo**

