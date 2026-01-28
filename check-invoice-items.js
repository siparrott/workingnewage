require('dotenv').config();
const neon = require('@neondatabase/serverless');
const { neonConfig } = neon;
neonConfig.fetchConnectionCache = true;
const sql = neon.neon(process.env.DATABASE_URL);

(async () => {
  try {
    // Check crm_clients columns
    const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='crm_clients' ORDER BY ordinal_position`;
    console.log('crm_clients columns:', cols.map(x => x.column_name).join(', '));
    
    // Get sample client
    const clients = await sql`SELECT * FROM crm_clients LIMIT 1`;
    console.log('\nSample client:', JSON.stringify(clients[0], null, 2));
    
  } catch (e) {
    console.log('Error:', e.message);
  }
})();
