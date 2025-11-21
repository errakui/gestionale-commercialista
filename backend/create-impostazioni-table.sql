-- Crea tabella impostazioni_generali
CREATE TABLE IF NOT EXISTS impostazioni_generali (
  id SERIAL PRIMARY KEY,
  "nomeStudio" VARCHAR(200) DEFAULT 'Studio Commercialista',
  timezone VARCHAR(50) DEFAULT 'Europe/Rome',
  "formatoData" VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  valuta VARCHAR(10) DEFAULT 'EUR',
  "giorniScadenzeImminenti" INTEGER DEFAULT 7,
  "emailNotifiche" VARCHAR(200),
  "notificheEmail" BOOLEAN DEFAULT true,
  "generaScadenzeAutomatiche" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserisci record di default
INSERT INTO impostazioni_generali (id, "nomeStudio", timezone, "formatoData", valuta, "giorniScadenzeImminenti")
VALUES (1, 'Studio Commercialista', 'Europe/Rome', 'DD/MM/YYYY', 'EUR', 7)
ON CONFLICT (id) DO NOTHING;

