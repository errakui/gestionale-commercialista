import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tabella utenti
    await queryRunner.query(`
      CREATE TABLE utenti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        attivo TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabella clienti
    await queryRunner.query(`
      CREATE TABLE clienti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo_cliente ENUM('DITTA_INDIVIDUALE', 'SRL', 'SNC', 'LIBERO_PROF', 'PRIVATO') NOT NULL,
        ragione_sociale VARCHAR(255) NULL,
        nome VARCHAR(100) NULL,
        cognome VARCHAR(100) NULL,
        codice_fiscale VARCHAR(16) NULL,
        partita_iva VARCHAR(11) NULL,
        indirizzo VARCHAR(255) NULL,
        cap VARCHAR(10) NULL,
        citta VARCHAR(100) NULL,
        provincia VARCHAR(2) NULL,
        email VARCHAR(255) NULL,
        pec VARCHAR(255) NULL,
        telefono VARCHAR(50) NULL,
        regime_fiscale VARCHAR(100) NULL,
        periodicita_iva ENUM('MENSILE', 'TRIMESTRALE', 'NESSUNA') DEFAULT 'NESSUNA',
        ha_immobili TINYINT(1) DEFAULT 0,
        attivo TINYINT(1) DEFAULT 1,
        note_interne TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_attivo (attivo),
        INDEX idx_cf (codice_fiscale),
        INDEX idx_piva (partita_iva)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabella scadenze
    await queryRunner.query(`
      CREATE TABLE scadenze (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NULL,
        data_scadenza DATE NOT NULL,
        tipo_scadenza VARCHAR(255) NOT NULL,
        stato ENUM('DA_FARE', 'IN_CORSO', 'FATTO') DEFAULT 'DA_FARE',
        note TEXT NULL,
        movimento_cassa_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_data_scadenza (data_scadenza),
        INDEX idx_stato (stato),
        INDEX idx_cliente_id (cliente_id),
        FOREIGN KEY (cliente_id) REFERENCES clienti(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabella movimenti_cassa
    await queryRunner.query(`
      CREATE TABLE movimenti_cassa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NULL,
        data_movimento DATE NOT NULL,
        tipo ENUM('ENTRATA', 'USCITA') NOT NULL,
        categoria VARCHAR(100) NULL,
        descrizione TEXT NOT NULL,
        importo DECIMAL(10, 2) NOT NULL,
        metodo_pagamento VARCHAR(50) NULL,
        scadenza_id INT NULL,
        note TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_data_movimento (data_movimento),
        INDEX idx_tipo (tipo),
        INDEX idx_cliente_id (cliente_id),
        FOREIGN KEY (cliente_id) REFERENCES clienti(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabella note_clienti
    await queryRunner.query(`
      CREATE TABLE note_clienti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NOT NULL,
        titolo VARCHAR(255) NOT NULL,
        contenuto TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_cliente_id (cliente_id),
        FOREIGN KEY (cliente_id) REFERENCES clienti(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabella template_scadenze
    await queryRunner.query(`
      CREATE TABLE template_scadenze (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codice_template VARCHAR(100) UNIQUE NOT NULL,
        descrizione VARCHAR(255) NOT NULL,
        tipo_ricorrenza ENUM('MENSILE', 'TRIMESTRALE', 'ANNUALE', 'CUSTOM') NOT NULL,
        giorno_scadenza INT NULL,
        mesi_applicabili JSON NULL,
        offset_mesi INT DEFAULT 0,
        offset_anni INT DEFAULT 0,
        applicabile_iva_mensile TINYINT(1) DEFAULT 0,
        applicabile_iva_trimestrale TINYINT(1) DEFAULT 0,
        applicabile_immobili TINYINT(1) DEFAULT 0,
        applicabile_tutti TINYINT(1) DEFAULT 0,
        attivo TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabella categorie_movimento
    await queryRunner.query(`
      CREATE TABLE categorie_movimento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) UNIQUE NOT NULL,
        descrizione TEXT NULL,
        attiva TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS note_clienti;`);
    await queryRunner.query(`DROP TABLE IF EXISTS movimenti_cassa;`);
    await queryRunner.query(`DROP TABLE IF EXISTS scadenze;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categorie_movimento;`);
    await queryRunner.query(`DROP TABLE IF EXISTS template_scadenze;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clienti;`);
    await queryRunner.query(`DROP TABLE IF EXISTS utenti;`);
  }
}

