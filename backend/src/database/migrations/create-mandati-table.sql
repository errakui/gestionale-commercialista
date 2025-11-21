-- Creazione tabella mandati
CREATE TABLE IF NOT EXISTS mandati (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clienti(id) ON DELETE SET NULL,
  nome_cliente VARCHAR(255) NOT NULL,
  cf_piva_cliente VARCHAR(50) NOT NULL,
  indirizzo_cliente VARCHAR(500),
  email_cliente VARCHAR(255),
  pec_cliente VARCHAR(255),
  tipo_contabilita VARCHAR(100) NOT NULL,
  compenso VARCHAR(255) NOT NULL,
  modalita_pagamento VARCHAR(255),
  servizi_inclusi TEXT,
  servizi_extra TEXT,
  data_inizio DATE NOT NULL,
  luogo_data VARCHAR(255) NOT NULL,
  testo_mandato TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_mandati_cliente_id ON mandati(cliente_id);
CREATE INDEX IF NOT EXISTS idx_mandati_created_at ON mandati(created_at);

