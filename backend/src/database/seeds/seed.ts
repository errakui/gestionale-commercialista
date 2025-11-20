import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connesso. Inizio seeding...');

    // 1. Crea utente admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await AppDataSource.query(
      `INSERT INTO utenti (username, email, password_hash, attivo) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE email = email`,
      ['admin', 'admin@studio.it', hashedPassword, 1]
    );
    console.log('✓ Utente admin creato (username: admin, password: Admin123!)');

    // 2. Template scadenze IVA
    const templates = [
      {
        codice: 'IVA_MENSILE',
        descrizione: 'Liquidazione IVA Mensile',
        tipo: 'MENSILE',
        giorno: 16,
        mesi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        offset_mesi: 1,
        iva_mensile: 1,
      },
      {
        codice: 'IVA_TRIMESTRE_1',
        descrizione: 'Liquidazione IVA I Trimestre',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [5],
        offset_mesi: 0,
        iva_trimestrale: 1,
      },
      {
        codice: 'IVA_TRIMESTRE_2',
        descrizione: 'Liquidazione IVA II Trimestre',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [8],
        offset_mesi: 0,
        iva_trimestrale: 1,
      },
      {
        codice: 'IVA_TRIMESTRE_3',
        descrizione: 'Liquidazione IVA III Trimestre',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [11],
        offset_mesi: 0,
        iva_trimestrale: 1,
      },
      {
        codice: 'IVA_TRIMESTRE_4',
        descrizione: 'Liquidazione IVA IV Trimestre',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [2],
        offset_mesi: 0,
        offset_anni: 1,
        iva_trimestrale: 1,
      },
      {
        codice: 'IVA_ANNUALE',
        descrizione: 'Dichiarazione IVA Annuale',
        tipo: 'ANNUALE',
        giorno: 30,
        mesi: [4],
        offset_mesi: 0,
        offset_anni: 1,
        applicabile_tutti: 1,
      },
      {
        codice: 'IMU_ACCONTO',
        descrizione: 'IMU - Acconto',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [6],
        offset_mesi: 0,
        applicabile_immobili: 1,
      },
      {
        codice: 'IMU_SALDO',
        descrizione: 'IMU - Saldo',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [12],
        offset_mesi: 0,
        applicabile_immobili: 1,
      },
      {
        codice: 'REDDITI_PF',
        descrizione: 'Dichiarazione Redditi Persone Fisiche',
        tipo: 'ANNUALE',
        giorno: 30,
        mesi: [11],
        offset_mesi: 0,
        offset_anni: 1,
        applicabile_tutti: 1,
      },
      {
        codice: 'REDDITI_SP',
        descrizione: 'Dichiarazione Redditi Società di Persone',
        tipo: 'ANNUALE',
        giorno: 30,
        mesi: [11],
        offset_mesi: 0,
        offset_anni: 1,
        applicabile_tutti: 1,
      },
      {
        codice: 'REDDITI_SC',
        descrizione: 'Dichiarazione Redditi Società di Capitali',
        tipo: 'ANNUALE',
        giorno: 30,
        mesi: [11],
        offset_mesi: 0,
        offset_anni: 1,
        applicabile_tutti: 1,
      },
      {
        codice: 'INPS_COMMERCIANTI_T1',
        descrizione: 'INPS Commercianti - I Trimestre',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [5],
        offset_mesi: 0,
        applicabile_tutti: 1,
      },
      {
        codice: 'INPS_COMMERCIANTI_T2',
        descrizione: 'INPS Commercianti - II Trimestre',
        tipo: 'ANNUALE',
        giorno: 20,
        mesi: [8],
        offset_mesi: 0,
        applicabile_tutti: 1,
      },
      {
        codice: 'INPS_COMMERCIANTI_T3',
        descrizione: 'INPS Commercianti - III Trimestre',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [11],
        offset_mesi: 0,
        applicabile_tutti: 1,
      },
      {
        codice: 'INPS_COMMERCIANTI_T4',
        descrizione: 'INPS Commercianti - IV Trimestre',
        tipo: 'ANNUALE',
        giorno: 16,
        mesi: [2],
        offset_mesi: 0,
        offset_anni: 1,
        applicabile_tutti: 1,
      },
    ];

    for (const template of templates) {
      await AppDataSource.query(
        `INSERT INTO template_scadenze 
         (codice_template, descrizione, tipo_ricorrenza, giorno_scadenza, mesi_applicabili, 
          offset_mesi, offset_anni, applicabile_iva_mensile, applicabile_iva_trimestrale, 
          applicabile_immobili, applicabile_tutti, attivo) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE descrizione = descrizione`,
        [
          template.codice,
          template.descrizione,
          template.tipo,
          template.giorno,
          JSON.stringify(template.mesi),
          template.offset_mesi || 0,
          template.offset_anni || 0,
          template.iva_mensile || 0,
          template.iva_trimestrale || 0,
          template.applicabile_immobili || 0,
          template.applicabile_tutti || 0,
          1,
        ]
      );
    }
    console.log('✓ Template scadenze creati');

    // 3. Categorie movimento
    const categorie = [
      'Parcelle',
      'Imposte e Tributi',
      'Affitto Studio',
      'Stipendi',
      'Software e Abbonamenti',
      'Spese Bancarie',
      'Utenze',
      'Cancelleria',
      'Formazione',
      'Altro',
    ];

    for (const categoria of categorie) {
      await AppDataSource.query(
        `INSERT INTO categorie_movimento (nome, attiva) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE nome = nome`,
        [categoria, 1]
      );
    }
    console.log('✓ Categorie movimento create');

    console.log('\n=== SEEDING COMPLETATO ===');
    console.log('Username: admin');
    console.log('Password: Admin123!');
    console.log('IMPORTANTE: Cambia la password al primo accesso!\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Errore durante il seeding:', error);
    process.exit(1);
  }
}

seed();

