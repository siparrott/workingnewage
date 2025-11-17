require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

(async () => {
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invoices' ORDER BY ordinal_position`;
  console.log('invoices table columns:');
  cols.forEach(c => console.log(`  ${c.column_name} (${c.data_type})`));
  
  console.log('\ncrm_invoices table columns:');
  const cols2 = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'crm_invoices' ORDER BY ordinal_position`;
  cols2.forEach(c => console.log(`  ${c.column_name} (${c.data_type})`));
})();
