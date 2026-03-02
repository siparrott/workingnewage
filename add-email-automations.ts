/**
 * Migration: Create email_automations and email_automation_logs tables
 * Also seeds 3 default automation rules
 * Run: npx tsx add-email-automations.ts
 */
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function migrate() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  console.log('Creating email_automations table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_automations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      trigger_type TEXT NOT NULL DEFAULT 'before_booking',
      offset_hours INTEGER NOT NULL DEFAULT -48,
      email_subject TEXT NOT NULL,
      email_body_html TEXT NOT NULL,
      questionnaire_slug TEXT,
      enabled BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ email_automations table created');

  console.log('Creating email_automation_logs table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_automation_logs (
      id SERIAL PRIMARY KEY,
      automation_id INTEGER NOT NULL REFERENCES email_automations(id) ON DELETE CASCADE,
      booking_id TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_name TEXT,
      status TEXT NOT NULL DEFAULT 'sent',
      error_message TEXT,
      sent_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ email_automation_logs table created');

  // Create indexes
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_automation_logs_booking ON email_automation_logs(booking_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_automation_logs_automation ON email_automation_logs(automation_id);`);

  // Check if default automations already exist
  const existing = await pool.query(`SELECT COUNT(*) as count FROM email_automations`);
  if (parseInt(existing.rows[0].count) > 0) {
    console.log(`⚠️  ${existing.rows[0].count} automations already exist, skipping seed`);
  } else {
    console.log('Seeding default automation rules...');

    // 1. Questionnaire 7 days before
    await pool.query(`
      INSERT INTO email_automations (name, description, trigger_type, offset_hours, email_subject, email_body_html, questionnaire_slug, enabled)
      VALUES (
        'Fragebogen vor dem Shooting',
        'Sendet einen Vorbereitungs-Fragebogen 7 Tage vor dem Termin',
        'before_booking',
        -168,
        'Ihr Fotoshooting naht – bitte füllen Sie unseren kurzen Fragebogen aus',
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; margin: 0;">New Age Fotografie</h1>
            <p style="color: #666; margin: 5px 0;">Familienfotograf Wien</p>
          </div>
          <h2 style="color: #333;">Hallo {{clientName}},</h2>
          <p style="color: #555; line-height: 1.6;">Ihr Fotoshooting am <strong>{{bookingDate}}</strong> rückt näher! 🎉</p>
          <p style="color: #555; line-height: 1.6;">Um Ihr Shooting optimal vorzubereiten, bitten wir Sie, unseren kurzen Fragebogen auszufüllen. So können wir sicherstellen, dass alles perfekt wird.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{questionnaireLink}}" style="background-color: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Fragebogen ausfüllen</a>
          </div>
          <p style="color: #555; line-height: 1.6;">Falls Sie Fragen haben, erreichen Sie mich jederzeit per WhatsApp unter +43 677 633 99210 oder per E-Mail.</p>
          <p style="color: #555;">Ich freue mich auf unser Shooting! 📸</p>
          <p style="color: #555;">Herzliche Grüße,<br><strong>Simon – New Age Fotografie</strong></p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #999; font-size: 12px;">New Age Fotografie | Wehrgasse 11A/2+5, 1050 Wien</p>
          </div>
        </div>',
        'pre-shoot',
        true
      )
    `);
    console.log('  ✅ Fragebogen (7 Tage vorher)');

    // 2. Reminder 2 days before
    await pool.query(`
      INSERT INTO email_automations (name, description, trigger_type, offset_hours, email_subject, email_body_html, enabled)
      VALUES (
        'Termin-Erinnerung',
        'Sendet eine Erinnerung 2 Tage vor dem Termin',
        'before_booking',
        -48,
        'Erinnerung: Ihr Fotoshooting am {{bookingDate}}',
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; margin: 0;">New Age Fotografie</h1>
            <p style="color: #666; margin: 5px 0;">Familienfotograf Wien</p>
          </div>
          <h2 style="color: #333;">Hallo {{clientName}},</h2>
          <p style="color: #555; line-height: 1.6;">eine freundliche Erinnerung, dass Ihr Fotoshooting in <strong>2 Tagen</strong> stattfindet:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #333;"><strong>📅 Datum:</strong> {{bookingDate}}</p>
            <p style="margin: 5px 0; color: #333;"><strong>⏰ Uhrzeit:</strong> {{bookingTime}}</p>
          </div>
          <h3 style="color: #333;">Tipps für ein gelungenes Shooting:</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>Bringen Sie bequeme Kleidung in abgestimmten Farben mit</li>
            <li>Planen Sie genügend Zeit ein, damit kein Stress entsteht</li>
            <li>Kinder dürfen ruhig ihr Lieblingsspielzeug mitbringen</li>
            <li>Bei Outdoor-Shootings: Denken Sie an wetterfeste Alternativen</li>
          </ul>
          <p style="color: #555; line-height: 1.6;">Bei Fragen oder wenn Sie den Termin ändern müssen, kontaktieren Sie mich bitte per WhatsApp: <strong>+43 677 633 99210</strong></p>
          <p style="color: #555;">Bis bald! 📸</p>
          <p style="color: #555;">Herzliche Grüße,<br><strong>Simon – New Age Fotografie</strong></p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #999; font-size: 12px;">New Age Fotografie | Wehrgasse 11A/2+5, 1050 Wien</p>
          </div>
        </div>',
        true
      )
    `);
    console.log('  ✅ Erinnerung (2 Tage vorher)');

    // 3. Review request 1 hour after
    await pool.query(`
      INSERT INTO email_automations (name, description, trigger_type, offset_hours, email_subject, email_body_html, enabled)
      VALUES (
        'Bewertung & Qualitätskontrolle',
        'Sendet eine Bitte um Bewertung 1 Stunde nach dem Termin',
        'after_booking',
        1,
        'Wie war Ihr Fotoshooting? Wir freuen uns auf Ihr Feedback! ⭐',
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; margin: 0;">New Age Fotografie</h1>
            <p style="color: #666; margin: 5px 0;">Familienfotograf Wien</p>
          </div>
          <h2 style="color: #333;">Hallo {{clientName}},</h2>
          <p style="color: #555; line-height: 1.6;">vielen Dank, dass Sie heute bei uns waren! Ich hoffe, das Shooting hat Ihnen genauso viel Spaß gemacht wie mir. 😊</p>
          <p style="color: #555; line-height: 1.6;">Ihre Meinung ist mir sehr wichtig. Würden Sie sich einen Moment Zeit nehmen, um Ihr Erlebnis zu bewerten?</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://g.page/r/CfDZy1MDBaP0EAE/review" style="background-color: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">⭐ Bewertung abgeben</a>
          </div>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin: 0 0 10px 0;">Wie geht es weiter?</h3>
            <ol style="color: #555; line-height: 1.8; margin: 0;">
              <li>Ich wähle die besten Bilder aus und bearbeite sie sorgfältig</li>
              <li>Innerhalb von 2–3 Wochen erhalten Sie Ihre persönliche Online-Galerie</li>
              <li>Sie können Ihre Lieblingsbilder auswählen und herunterladen</li>
            </ol>
          </div>
          <p style="color: #555; line-height: 1.6;">Falls Sie Fragen haben, bin ich jederzeit per WhatsApp (+43 677 633 99210) oder E-Mail erreichbar.</p>
          <p style="color: #555;">Herzliche Grüße,<br><strong>Simon – New Age Fotografie</strong></p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #999; font-size: 12px;">New Age Fotografie | Wehrgasse 11A/2+5, 1050 Wien</p>
          </div>
        </div>',
        true
      )
    `);
    console.log('  ✅ Bewertung (1 Stunde danach)');
  }

  console.log('\n🎉 Migration complete!');
  await pool.end();
}

migrate().catch(console.error);
