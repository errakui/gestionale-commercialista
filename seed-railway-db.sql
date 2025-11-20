-- Seed Database Railway PostgreSQL

-- Template scadenze IVA Mensile
INSERT INTO template_scadenze (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, applicabile_iva_mensile, applicabile_tutti) 
VALUES ('IVA_MENSILE', 'Liquidazione IVA Mensile', 'MENSILE', 16, '[1,2,3,4,5,6,7,8,9,10,11,12]', true, false) 
ON CONFLICT (codice_template) DO NOTHING;

-- Template IVA Trimestrale
INSERT INTO template_scadenze (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, applicabile_iva_trimestrale)
VALUES ('IVA_TRIM_Q1', 'Liquidazione IVA I Trimestre', 'TRIMESTRALE', 16, '[5]', true) 
ON CONFLICT (codice_template) DO NOTHING;

INSERT INTO template_scadenze (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, applicabile_iva_trimestrale)
VALUES ('IVA_TRIM_Q2', 'Liquidazione IVA II Trimestre', 'TRIMESTRALE', 20, '[8]', true) 
ON CONFLICT (codice_template) DO NOTHING;

INSERT INTO template_scadenze (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, applicabile_iva_trimestrale)
VALUES ('IVA_TRIM_Q3', 'Liquidazione IVA III Trimestre', 'TRIMESTRALE', 16, '[11]', true) 
ON CONFLICT (codice_template) DO NOTHING;

INSERT INTO template_scadenze (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, applicabile_iva_trimestrale)
VALUES ('IVA_TRIM_Q4', 'Liquidazione IVA IV Trimestre', 'TRIMESTRALE', 16, '[3]', true) 
ON CONFLICT (codice_template) DO NOTHING;

-- IMU
INSERT INTO template_scadenze (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, applicabile_immobili)
VALUES ('IMU_ACCONTO', 'IMU - Acconto', 'ANNUALE', 16, '[6]', true) 
ON CONFLICT (codice_template) DO NOTHING;

INSERT INTO template_scadenze (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, applicabile_immobili)
VALUES ('IMU_SALDO', 'IMU - Saldo', 'ANNUALE', 16, '[12]', true) 
ON CONFLICT (codice_template) DO NOTHING;

-- Categorie movimento
INSERT INTO categorie_movimento (nome, descrizione) VALUES 
('Parcelle', 'Pagamenti clienti per parcelle'),
('Visure', 'Visure camerali e catastali'),
('Pratiche', 'Pratiche amministrative'),
('Affitto Studio', 'Canone locazione studio'),
('Utenze', 'Bollette e servizi'),
('Forniture', 'Materiale ufficio e forniture')
ON CONFLICT (nome) DO NOTHING;

-- Servizi predefiniti
INSERT INTO servizi_predefiniti (nome, descrizione, importo, categoria, applica_iva, aliquota_iva) VALUES
('Visura Camerale', 'Visura ordinaria Camera di Commercio', 50.00, 'Visure', true, 22),
('Dichiarazione Redditi', 'Modello 730 o Unico', 500.00, 'Dichiarazioni', true, 22),
('Bilancio Annuale', 'Redazione bilancio societario', 1500.00, 'Contabilità', true, 22),
('Consulenza Fiscale', 'Consulenza fiscale oraria', 100.00, 'Consulenze', true, 22),
('Pratica CCIAA', 'Pratica Camera di Commercio', 150.00, 'Pratiche', true, 22),
('Modello F24', 'Compilazione e invio F24', 30.00, 'Adempimenti', true, 22)
ON CONFLICT DO NOTHING;

