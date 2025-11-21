const axios = require('axios');

async function test() {
  // Login
  const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
    username: 'admin',
    password: 'Admin123!'
  });
  
  const token = loginRes.data.access_token;
  console.log('✅ Login OK\n');
  
  // GET impostazioni
  const getRes = await axios.get('http://localhost:3001/api/impostazioni/generali', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('📖 Impostazioni attuali:', getRes.data);
  
  // UPDATE impostazioni
  const updateRes = await axios.put('http://localhost:3001/api/impostazioni/generali', {
    nomeStudio: 'Studio Commercialista Professionale',
    giorniScadenzeImminenti: 14
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('\n✅ Impostazioni aggiornate:', updateRes.data);
  
  // GET di nuovo per verificare
  const getRes2 = await axios.get('http://localhost:3001/api/impostazioni/generali', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('\n📖 Impostazioni dopo update:', getRes2.data);
}

test().catch(err => console.error('❌ Errore:', err.response?.data || err.message));

