require('dotenv').config();
const neon = require('@neondatabase/serverless');
const { neonConfig } = neon;
neonConfig.fetchConnectionCache = true;
const sql = neon.neon(process.env.DATABASE_URL);

(async () => {
  try {
    // Check crm_invoice_items columns
    const cols = await sql`SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name='crm_invoice_items'`;
    console.log('crm_invoice_items structure:', JSON.stringify(cols, null, 2));
    
  } catch (e) {
    console.log('Error:', e.message);
  }
})();
