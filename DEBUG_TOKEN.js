const axios = require('axios');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:3001/api';

async function debugToken() {
  console.log('\n🔍 ======== DEBUG TOKEN ========\n');

  // Fai login
  const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
    username: 'admin',
    password: 'Admin123!'
  });
  
  const token = loginResponse.data.access_token;
  console.log('1️⃣ Token ricevuto:', token.substring(0, 50) + '...\n');

  // Decodifica il token SENZA verificarlo
  const decoded = jwt.decode(token);
  console.log('2️⃣ Token decodificato (senza verifica):');
  console.log(JSON.stringify(decoded, null, 2));
  console.log('');

  // Ora prova a verificarlo con la stessa secret del backend
  const secret = 'chiave_segreta_test_locale_123456789'; // SECRET DAL .env DEL BACKEND
  console.log('3️⃣ JWT_SECRET usato:', secret);

  try {
    const verified = jwt.verify(token, secret);
    console.log('✅ Token VERIFICATO con successo!');
    console.log(JSON.stringify(verified, null, 2));
  } catch (error) {
    console.error('❌ Errore verifica token:', error.message);
  }

  console.log('\n🏁 ======== DEBUG COMPLETATO ========\n');
}

debugToken().catch(console.error);

