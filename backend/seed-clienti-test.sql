-- ==========================================
-- SEED CLIENTI DI TEST
-- 6 Clienti con tutte le combinazioni fiscali
-- ==========================================

-- 1. CLIENTE CON IVA 22% + RITENUTA 20% (Professionista con P.IVA)
INSERT INTO cliente (
  tipoCliente, ragioneSociale, nome, cognome, codiceFiscale, partitaIva,
  email, telefono, indirizzo, cap, citta, provincia,
  regimeFiscale, periodicitaIva, haImmobili,
  soggettoIva, esenteIva, aliquotaIva,
  soggettoRitenuta, esenteRitenuta, aliquotaRitenuta,
  attivo, noteInterne
) VALUES (
  'LIBERO_PROF', 'Studio Legale Rossi & Associati', 'Mario', 'Rossi', 'RSSMRA80A01H501U', '12345678901',
  'mario.rossi@studiolegalerosi.it', '02 1234567', 'Via Roma 123', '20121', 'Milano', 'MI',
  'Regime Ordinario', 'MENSILE', false,
  true, false, 22,
  true, false, 20,
  true, 'Avvocato - Fattura con IVA 22% e Ritenuta 20%. Cliente principale dello studio.'
);

-- 2. CLIENTE CON IVA 22% SENZA RITENUTA (SRL - Azienda)
INSERT INTO cliente (
  tipoCliente, ragioneSociale, codiceFiscale, partitaIva,
  email, telefono, indirizzo, cap, citta, provincia,
  regimeFiscale, periodicitaIva, haImmobili,
  soggettoIva, esenteIva, aliquotaIva,
  soggettoRitenuta, esenteRitenuta, aliquotaRitenuta,
  attivo, noteInterne
) VALUES (
  'SRL', 'Tech Solutions SRL', '12345678901', '98765432109',
  'info@techsolutions.it', '02 9876543', 'Via Milano 456', '20100', 'Milano', 'MI',
  'Regime Ordinario', 'TRIMESTRALE', true,
  true, false, 22,
  false, true, 0,
  true, 'Società SRL - IVA 22% ma esente da ritenuta. Possiede immobili.'
);

-- 3. CLIENTE REGIME FORFETTARIO (Esente IVA + Esente Ritenuta)
INSERT INTO cliente (
  tipoCliente, ragioneSociale, nome, cognome, codiceFiscale, partitaIva,
  email, telefono, indirizzo, cap, citta, provincia,
  regimeFiscale, periodicitaIva, haImmobili,
  soggettoIva, esenteIva, aliquotaIva,
  soggettoRitenuta, esenteRitenuta, aliquotaRitenuta,
  attivo, noteInterne
) VALUES (
  'DITTA_INDIVIDUALE', 'Consulenza Web di Giuseppe Verdi', 'Giuseppe', 'Verdi', 'VRDGPP85M15F205Z', '11223344556',
  'giuseppe.verdi@consulenzaweb.it', '347 1234567', 'Via Verdi 78', '00100', 'Roma', 'RM',
  'Regime Forfettario', 'NESSUNA', false,
  false, true, 0,
  false, true, 0,
  true, 'Regime Forfettario - Nessuna IVA, nessuna ritenuta. Importi fissi.'
);

-- 4. CLIENTE ESENTE IVA MA CON RITENUTA (Professionista sanitario)
INSERT INTO cliente (
  tipoCliente, nome, cognome, codiceFiscale, partitaIva,
  email, telefono, indirizzo, cap, citta, provincia,
  regimeFiscale, periodicitaIva, haImmobili,
  soggettoIva, esenteIva, aliquotaIva,
  soggettoRitenuta, esenteRitenuta, aliquotaRitenuta,
  attivo, noteInterne
) VALUES (
  'LIBERO_PROF', 'Laura', 'Bianchi', 'BNCLAR75D45H501X', '55667788990',
  'laura.bianchi@medico.it', '333 7654321', 'Piazza Duomo 5', '20122', 'Milano', 'MI',
  'Regime Ordinario', 'NESSUNA', false,
  false, true, 0,
  true, false, 20,
  true, 'Medico - Esente IVA art.10 ma con ritenuta 20% su prestazioni sanitarie.'
);

-- 5. CLIENTE IVA 10% + RITENUTA (Editoria/Servizi particolari)
INSERT INTO cliente (
  tipoCliente, ragioneSociale, nome, cognome, codiceFiscale, partitaIva,
  email, telefono, indirizzo, cap, citta, provincia,
  regimeFiscale, periodicitaIva, haImmobili,
  soggettoIva, esenteIva, aliquotaIva,
  soggettoRitenuta, esenteRitenuta, aliquotaRitenuta,
  attivo, noteInterne
) VALUES (
  'DITTA_INDIVIDUALE', 'Editoria & Design di Franco Neri', 'Franco', 'Neri', 'NREFNC70T20L219W', '99887766554',
  'franco.neri@editoria.it', '02 5556677', 'Corso Italia 99', '20135', 'Milano', 'MI',
  'Regime Ordinario', 'MENSILE', false,
  true, false, 10,
  true, false, 20,
  true, 'Editore - IVA ridotta 10% + Ritenuta 20% su servizi editoriali.'
);

-- 6. CLIENTE PRIVATO (Persona fisica - Nessuna IVA, Nessuna Ritenuta)
INSERT INTO cliente (
  tipoCliente, nome, cognome, codiceFiscale,
  email, telefono, indirizzo, cap, citta, provincia,
  regimeFiscale, periodicitaIva, haImmobili,
  soggettoIva, esenteIva, aliquotaIva,
  soggettoRitenuta, esenteRitenuta, aliquotaRitenuta,
  attivo, noteInterne
) VALUES (
  'PRIVATO', 'Anna', 'Colombo', 'CLMNNA82S50F205L',
  'anna.colombo@email.it', '340 9988776', 'Via dei Fiori 12', '00187', 'Roma', 'RM',
  'Nessuno', 'NESSUNA', false,
  false, true, 0,
  false, true, 0,
  true, 'Cliente privato - Occasionale, senza P.IVA. Nessuna IVA e nessuna ritenuta.'
);

-- ==========================================
-- RIEPILOGO CLIENTI CREATI:
-- ==========================================
-- 1. Mario Rossi - Avvocato: IVA 22% + RA 20%
-- 2. Tech Solutions SRL: IVA 22% + NO RA
-- 3. Giuseppe Verdi - Forfettario: NO IVA + NO RA
-- 4. Laura Bianchi - Medico: NO IVA + RA 20%
-- 5. Franco Neri - Editore: IVA 10% + RA 20%
-- 6. Anna Colombo - Privato: NO IVA + NO RA
-- ==========================================

