const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

// Login
async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'Admin123!'
    });
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Errore login:', error.message);
    return null;
  }
}

// Servizi predefiniti di esempio
const servizi = [
  {
    nome: 'Dichiarazione IVA Trimestrale',
    descrizione: 'Compilazione e invio dichiarazione IVA trimestrale',
    importo: 150,
    categoria: 'Fiscale',
    applicaIva: true,
    aliquotaIva: 22,
    applicaRitenuta: true,
    aliquotaRitenuta: 20,
    attivo: true
  },
  {
    nome: 'Visura Camerale',
    descrizione: 'Richiesta visura camerale ordinaria',
    importo: 35,
    categoria: 'Visure',
    applicaIva: true,
    aliquotaIva: 22,
    applicaRitenuta: false,
    aliquotaRitenuta: 0,
    attivo: true
  },
  {
    nome: 'Consulenza Fiscale',
    descrizione: 'Consulenza fiscale generale (1 ora)',
    importo: 100,
    categoria: 'Consulenza',
    applicaIva: true,
    aliquotaIva: 22,
    applicaRitenuta: true,
    aliquotaRitenuta: 20,
    attivo: true
  },
  {
    nome: 'Modello F24',
    descrizione: 'Compilazione e invio modello F24',
    importo: 25,
    categoria: 'Adempimenti',
    applicaIva: true,
    aliquotaIva: 22,
    applicaRitenuta: false,
    aliquotaRitenuta: 0,
    attivo: true
  },
  {
    nome: 'Bilancio Annuale',
    descrizione: 'Redazione bilancio annuale societario',
    importo: 500,
    categoria: 'Contabilità',
    applicaIva: true,
    aliquotaIva: 22,
    applicaRitenuta: true,
    aliquotaRitenuta: 20,
    attivo: true
  }
];

// Crea tutti i servizi
async function seedServizi(token) {
  console.log('🚀 Inizio creazione servizi predefiniti...\n');

  for (const [index, servizio] of servizi.entries()) {
    try {
      await axios.post(`${API_URL}/servizi`, servizio, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Servizio ${index + 1}/5: ${servizio.nome} - €${servizio.importo}`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`ℹ️  Servizio ${index + 1}/5 già esistente`);
      } else {
        console.error(`❌ Errore servizio ${index + 1}:`, error.response?.data?.message || error.message);
      }
    }
  }

  console.log('\n🎉 SERVIZI CREATI!\n');
  console.log('📋 SERVIZI DISPONIBILI:');
  console.log('   1. Dichiarazione IVA Trimestrale - €150');
  console.log('   2. Visura Camerale - €35');
  console.log('   3. Consulenza Fiscale - €100');
  console.log('   4. Modello F24 - €25');
  console.log('   5. Bilancio Annuale - €500\n');
  console.log('🌐 Vai su http://localhost:3000/servizi per usarli!\n');
}

// Esegui
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   SEED SERVIZI PREDEFINITI                     ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  const token = await login();
  if (!token) {
    console.error('\n❌ ERRORE: Impossibile ottenere il token.');
    process.exit(1);
  }

  console.log('✅ Login effettuato\n');
  await seedServizi(token);
}

main().catch(console.error);

