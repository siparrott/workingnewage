const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: "postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
  try {
    // Check latest sent/outbound emails with all fields
    console.log('Most recent sent email details:');
    const result = await pool.query(`
      SELECT id, sender_name, sender_email, recipient_email, subject, content,
             message_type, status, direction, email_message_id, created_at, sent_at
      FROM crm_messages 
      WHERE direction = 'outbound' OR status IN ('sent', 'demo_sent')
      ORDER BY created_at DESC
      LIMIT 3
    `);
    result.rows.forEach(row => {
      console.log('---');
      console.log('ID:', row.id);
      console.log('To:', row.recipient_email);
      console.log('Subject:', row.subject);
      console.log('Status:', row.status);
      console.log('Direction:', row.direction);
      console.log('Message ID:', row.email_message_id);
      console.log('Created:', row.created_at);
      console.log('Sent:', row.sent_at);
    });
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
