const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

// Login per ottenere il token
async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Errore login:', error.message);
    return null;
  }
}

// Clienti di test con tutte le combinazioni fiscali
const clienti = [
  {
    tipoCliente: 'LIBERO_PROF',
    ragioneSociale: 'Studio Legale Rossi & Associati',
    nome: 'Mario',
    cognome: 'Rossi',
    codiceFiscale: 'RSSMRA80A01H501U',
    partitaIva: '12345678901',
    email: 'mario.rossi@studiolegalerosi.it',
    telefono: '02 1234567',
    indirizzo: 'Via Roma 123',
    cap: '20121',
    citta: 'Milano',
    provincia: 'MI',
    regimeFiscale: 'Regime Ordinario',
    periodicitaIva: 'MENSILE',
    haImmobili: false,
    soggettoIva: true,
    esenteIva: false,
    aliquotaIva: 22,
    soggettoRitenuta: true,
    esenteRitenuta: false,
    aliquotaRitenuta: 20,
    attivo: true,
    noteInterne: '✅ CASO 1: Avvocato con IVA 22% + Ritenuta 20%. Cliente principale dello studio.'
  },
  {
    tipoCliente: 'SRL',
    ragioneSociale: 'Tech Solutions SRL',
    codiceFiscale: '12345678901',
    partitaIva: '98765432109',
    email: 'info@techsolutions.it',
    telefono: '02 9876543',
    indirizzo: 'Via Milano 456',
    cap: '20100',
    citta: 'Milano',
    provincia: 'MI',
    regimeFiscale: 'Regime Ordinario',
    periodicitaIva: 'TRIMESTRALE',
    haImmobili: true,
    soggettoIva: true,
    esenteIva: false,
    aliquotaIva: 22,
    soggettoRitenuta: false,
    esenteRitenuta: true,
    aliquotaRitenuta: 0,
    attivo: true,
    noteInterne: '✅ CASO 2: Società SRL con IVA 22% ma ESENTE da ritenuta. Possiede immobili.'
  },
  {
    tipoCliente: 'DITTA_INDIVIDUALE',
    ragioneSociale: 'Consulenza Web di Giuseppe Verdi',
    nome: 'Giuseppe',
    cognome: 'Verdi',
    codiceFiscale: 'VRDGPP85M15F205Z',
    partitaIva: '11223344556',
    email: 'giuseppe.verdi@consulenzaweb.it',
    telefono: '347 1234567',
    indirizzo: 'Via Verdi 78',
    cap: '00100',
    citta: 'Roma',
    provincia: 'RM',
    regimeFiscale: 'Regime Forfettario',
    periodicitaIva: 'NESSUNA',
    haImmobili: false,
    soggettoIva: false,
    esenteIva: true,
    aliquotaIva: 0,
    soggettoRitenuta: false,
    esenteRitenuta: true,
    aliquotaRitenuta: 0,
    attivo: true,
    noteInterne: '✅ CASO 3: Regime Forfettario - ESENTE IVA + ESENTE Ritenuta. Importi fissi.'
  },
  {
    tipoCliente: 'LIBERO_PROF',
    nome: 'Laura',
    cognome: 'Bianchi',
    codiceFiscale: 'BNCLAR75D45H501X',
    partitaIva: '55667788990',
    email: 'laura.bianchi@medico.it',
    telefono: '333 7654321',
    indirizzo: 'Piazza Duomo 5',
    cap: '20122',
    citta: 'Milano',
    provincia: 'MI',
    regimeFiscale: 'Regime Ordinario',
    periodicitaIva: 'NESSUNA',
    haImmobili: false,
    soggettoIva: false,
    esenteIva: true,
    aliquotaIva: 0,
    soggettoRitenuta: true,
    esenteRitenuta: false,
    aliquotaRitenuta: 20,
    attivo: true,
    noteInterne: '✅ CASO 4: Medico - ESENTE IVA art.10 ma CON Ritenuta 20% su prestazioni sanitarie.'
  },
  {
    tipoCliente: 'DITTA_INDIVIDUALE',
    ragioneSociale: 'Editoria & Design di Franco Neri',
    nome: 'Franco',
    cognome: 'Neri',
    codiceFiscale: 'NREFNC70T20L219W',
    partitaIva: '99887766554',
    email: 'franco.neri@editoria.it',
    telefono: '02 5556677',
    indirizzo: 'Corso Italia 99',
    cap: '20135',
    citta: 'Milano',
    provincia: 'MI',
    regimeFiscale: 'Regime Ordinario',
    periodicitaIva: 'MENSILE',
    haImmobili: false,
    soggettoIva: true,
    esenteIva: false,
    aliquotaIva: 10,
    soggettoRitenuta: true,
    esenteRitenuta: false,
    aliquotaRitenuta: 20,
    attivo: true,
    noteInterne: '✅ CASO 5: Editore con IVA RIDOTTA 10% + Ritenuta 20% su servizi editoriali.'
  },
  {
    tipoCliente: 'PRIVATO',
    nome: 'Anna',
    cognome: 'Colombo',
    codiceFiscale: 'CLMNNA82S50F205L',
    email: 'anna.colombo@email.it',
    telefono: '340 9988776',
    indirizzo: 'Via dei Fiori 12',
    cap: '00187',
    citta: 'Roma',
    provincia: 'RM',
    regimeFiscale: 'Nessuno',
    periodicitaIva: 'NESSUNA',
    haImmobili: false,
    soggettoIva: false,
    esenteIva: true,
    aliquotaIva: 0,
    soggettoRitenuta: false,
    esenteRitenuta: true,
    aliquotaRitenuta: 0,
    attivo: true,
    noteInterne: '✅ CASO 6: Cliente PRIVATO - Occasionale, senza P.IVA. NO IVA + NO Ritenuta.'
  }
];

// Crea tutti i clienti
async function seedClienti() {
  console.log('🚀 Inizio creazione clienti di test...\n');
  
  const token = await login();
  if (!token) {
    console.error('❌ Impossibile ottenere il token di autenticazione');
    return;
  }

  console.log('✅ Login effettuato con successo\n');

  for (const [index, cliente] of clienti.entries()) {
    try {
      const response = await axios.post(`${API_URL}/clienti`, cliente, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Cliente ${index + 1}/6 creato: ${cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`}`);
      console.log(`   ${cliente.noteInterne}\n`);
    } catch (error) {
      console.error(`❌ Errore creazione cliente ${index + 1}:`, error.response?.data?.message || error.message);
    }
  }

  console.log('\n🎉 Seed completato! Tutti i 6 clienti sono stati creati.\n');
  console.log('📋 RIEPILOGO CASI FISCALI:');
  console.log('   1. Mario Rossi (Avvocato): IVA 22% + RA 20%');
  console.log('   2. Tech Solutions SRL: IVA 22% + NO RA');
  console.log('   3. Giuseppe Verdi (Forfettario): NO IVA + NO RA');
  console.log('   4. Laura Bianchi (Medico): NO IVA + RA 20%');
  console.log('   5. Franco Neri (Editore): IVA 10% + RA 20%');
  console.log('   6. Anna Colombo (Privato): NO IVA + NO RA\n');
}

// Esegui
seedClienti().catch(console.error);

