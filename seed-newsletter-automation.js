const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require' });

const emailHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7C3AED; margin: 0;">New Age Fotografie</h1>
    <p style="color: #666; margin: 5px 0;">Familienfotograf Wien</p>
  </div>
  <h2 style="color: #333; text-align: center;">Vielen Dank für Ihr Interesse! 🎉</h2>
  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
    <h3 style="color: #7C3AED; margin: 0 0 20px 0; font-size: 24px;">Ihr 50€ Fotoshooting-Gutschein</h3>
    <div style="background-color: #7C3AED; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 18px; font-weight: bold;">VOUCHER50</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;">Gutscheincode für 50€ Rabatt</p>
    </div>
    <p style="color: #666; margin: 10px 0;">Gültig für alle Fotoshooting-Pakete. Einfach bei der Buchung angeben.</p>
  </div>
  <div style="margin: 30px 0;">
    <h3 style="color: #333;">So einfach geht's:</h3>
    <ol style="color: #666; line-height: 1.6;">
      <li>WhatsApp an <strong>+43 677 633 99210</strong> oder E-Mail an <strong>hallo@newagefotografie.com</strong></li>
      <li>Ihren Wunschtermin nennen</li>
      <li>Gutscheincode <strong>VOUCHER50</strong> erwähnen</li>
      <li>50€ sparen und wunderschöne Erinnerungen schaffen!</li>
    </ol>
  </div>
  <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #333; margin: 0 0 10px 0;">Unsere Fotoshootings:</h4>
    <ul style="color: #666; margin: 0; padding-left: 20px;">
      <li>Familienfotografie</li>
      <li>Neugeborenen-Fotografie</li>
      <li>Schwangerschaftsfotos</li>
      <li>Business-Headshots</li>
    </ul>
  </div>
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p style="margin: 0; color: #666; font-size: 14px;">New Age Fotografie | Wehrgasse 11A/2+5, 1050 Wien<br>Tel/WhatsApp: +43 677 633 99210 | E-Mail: hallo@newagefotografie.com</p>
  </div>
</div>`;

pool.query(
  `INSERT INTO email_automations (name, description, trigger_type, offset_hours, email_subject, email_body_html, enabled)
   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
  [
    'Newsletter Gutschein (50€)',
    'Automatische E-Mail mit 50€ Gutschein bei Newsletter-Anmeldung auf der Website',
    'newsletter_signup',
    0,
    '🎉 Ihr 50€ Fotoshooting-Gutschein ist da!',
    emailHtml,
    true
  ]
).then(r => {
  console.log('✅ Inserted newsletter automation, id:', r.rows[0].id);
  pool.end();
}).catch(e => {
  console.error('Error:', e.message);
  pool.end();
});
