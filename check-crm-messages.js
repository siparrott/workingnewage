const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: "postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
  try {
    // Add recipient_email column if it doesn't exist
    console.log('Adding recipient_email column...');
    await pool.query(`
      ALTER TABLE crm_messages 
      ADD COLUMN IF NOT EXISTS recipient_email TEXT
    `);
    console.log('✅ recipient_email column added');
    
    // Verify the column was added
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'crm_messages' AND column_name = 'recipient_email'
    `);
    console.log('Verification:', JSON.stringify(result.rows, null, 2));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
