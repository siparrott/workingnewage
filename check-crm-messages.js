const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: "postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
  try {
    // Check the test email in crm_messages
    const result = await pool.query(`
      SELECT id, sender_name, sender_email, recipient_email, subject, content, 
             message_type, status, direction, created_at 
      FROM crm_messages 
      WHERE subject ILIKE '%test%' OR content ILIKE '%123%'
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.log('Test emails in crm_messages:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    // Also check sent emails
    console.log('\\nRecent sent/outbound emails:');
    const sent = await pool.query(`
      SELECT id, sender_name, sender_email, recipient_email, subject, 
             message_type, status, direction, created_at 
      FROM crm_messages 
      WHERE direction = 'outbound' OR status IN ('sent', 'demo_sent')
      ORDER BY created_at DESC
      LIMIT 10
    `);
    console.log(JSON.stringify(sent.rows, null, 2));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
