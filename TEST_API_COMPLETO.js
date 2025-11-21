const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testCompleto() {
  console.log('\n🔍 ======== TEST COMPLETO API ========\n');

  let token = null;

  // ========== TEST 1: LOGIN ==========
  try {
    console.log('1️⃣ TEST LOGIN...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'Admin123!'
    });
    
    token = loginResponse.data.access_token;
    console.log('✅ LOGIN OK');
    console.log('   Token ricevuto:', token.substring(0, 30) + '...');
    console.log('   User:', loginResponse.data.user.username);
  } catch (error) {
    console.error('❌ LOGIN FALLITO:', error.response?.data || error.message);
    process.exit(1);
  }

  // ========== TEST 2: /me CON TOKEN ==========
  try {
    console.log('\n2️⃣ TEST /auth/me CON TOKEN...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ /me OK');
    console.log('   User autenticato:', meResponse.data.user.username);
  } catch (error) {
    console.error('❌ /me FALLITO:', error.response?.status, error.response?.data || error.message);
  }

  // ========== TEST 3: GET CLIENTI CON TOKEN ==========
  try {
    console.log('\n3️⃣ TEST GET /clienti CON TOKEN...');
    const clientiResponse = await axios.get(`${BASE_URL}/clienti`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ GET CLIENTI OK');
    console.log('   Numero clienti:', clientiResponse.data.length);
    if (clientiResponse.data.length > 0) {
      console.log('   Primo cliente:', clientiResponse.data[0].ragioneSociale || clientiResponse.data[0].nome);
    }
  } catch (error) {
    console.error('❌ GET CLIENTI FALLITO:', error.response?.status, error.response?.data || error.message);
  }

  // ========== TEST 4: GET CLIENTI SENZA TOKEN (DEVE FALLIRE) ==========
  try {
    console.log('\n4️⃣ TEST GET /clienti SENZA TOKEN (deve dare 401)...');
    await axios.get(`${BASE_URL}/clienti`);
    console.log('❌ PROBLEMA: La richiesta senza token è passata! (NON dovrebbe)');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ CORRETTO: 401 Unauthorized come previsto');
    } else {
      console.error('❌ Errore inaspettato:', error.response?.status, error.response?.data || error.message);
    }
  }

  // ========== TEST 5: GET IMPOSTAZIONI GENERALI ==========
  try {
    console.log('\n5️⃣ TEST GET /impostazioni/generali CON TOKEN...');
    const impostazioniResponse = await axios.get(`${BASE_URL}/impostazioni/generali`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ GET IMPOSTAZIONI OK');
    console.log('   Nome Studio:', impostazioniResponse.data.nomeStudio);
    console.log('   Timezone:', impostazioniResponse.data.timezone);
  } catch (error) {
    console.error('❌ GET IMPOSTAZIONI FALLITO:', error.response?.status, error.response?.data || error.message);
    console.error('   Questo è il problema dell\'errore 500!');
  }

  console.log('\n🏁 ======== TEST COMPLETATO ========\n');
}

testCompleto();

