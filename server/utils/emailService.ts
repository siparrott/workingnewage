import nodemailer from 'nodemailer';
import { config } from '../config-reader';

// Email service for questionnaire notifications
export async function sendStudioNotificationEmail(clientName: string, clientEmail: string, answers: any, link: any) {
  try {
    // Get email settings from DB first, then environment variables
    const emailSettings = {
      host: await config.getOrDefault('smtp_host', 'smtp.easyname.com'),
      port: await config.getNumber('smtp_port', 587),
      user: await config.get('smtp_user') || process.env.EMAIL_USER,
      pass: await config.get('smtp_pass') || process.env.EMAIL_PASS,
      fromEmail: await config.getOrDefault('from_email', ''),
      studioEmail: await config.getOrDefault('studio_notify_email', '')
    };

    if (!emailSettings.user || !emailSettings.pass) {
      console.error('Email credentials not configured');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: emailSettings.host,
      port: emailSettings.port,
      secure: emailSettings.port === 465,
      auth: {
        user: emailSettings.user,
        pass: emailSettings.pass
      }
    });

    // Build answers summary
    let answersText = '';
    for (const [key, value] of Object.entries(answers)) {
      const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      answersText += `${cleanKey}: ${value}\n`;
    }

    const subject = `New Client Questionnaire - ${clientName}`;
    const text = `
Neue Fragebogen-Antwort erhalten!

Client: ${clientName}
Email: ${clientEmail}

Antworten:
${answersText}

---
${process.env.STUDIO_NAME || 'My Studio'} CRM System
    `;

    const html = `
      <h2>Neue Fragebogen-Antwort erhalten!</h2>
      
      <p><strong>Client:</strong> ${clientName}</p>
      <p><strong>Email:</strong> ${clientEmail}</p>
      
      <h3>Antworten:</h3>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${answersText.split('\n').map(line => line ? `<p>${line}</p>` : '').join('')}
      </div>
      
      <hr>
      <p style="color: #666; font-size: 12px;">${process.env.STUDIO_NAME || 'My Studio'} CRM System</p>
    `;

    await transporter.sendMail({
      from: `"${process.env.STUDIO_NAME || 'My Studio'}" <${emailSettings.fromEmail}>`,
      to: emailSettings.studioEmail,
      subject,
      text,
      html
    });

    console.log('Studio notification email sent successfully');
  } catch (error) {
    console.error('Error sending studio notification email:', error);
    throw error;
  }
}

export async function sendClientConfirmationEmail(clientEmail: string, clientName: string) {
  try {
    const emailSettings = {
      host: process.env.SMTP_HOST || 'smtp.easyname.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      fromEmail: process.env.FROM_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@example.com'
    };

    if (!emailSettings.user || !emailSettings.pass) {
      console.error('Email credentials not configured');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.host,
      port: emailSettings.port,
      secure: emailSettings.port === 465,
      auth: {
        user: emailSettings.user,
        pass: emailSettings.pass
      }
    });

    const subject = 'Vielen Dank für Ihren Fragebogen';
    const studioName = process.env.STUDIO_NAME || 'My Studio';
    const siteUrl = process.env.APP_URL || process.env.BASE_URL || '';
    const text = `
Liebe/r ${clientName},

vielen Dank, dass Sie unseren Fragebogen ausgefüllt haben!

Wir haben Ihre Antworten erhalten und werden uns in Kürze bei Ihnen melden, um weitere Details für Ihr Fotoshooting zu besprechen.

Bei Fragen können Sie uns jederzeit kontaktieren.

Mit freundlichen Grüßen,
Ihr Team von ${studioName}

---
${studioName}
${siteUrl ? `Website: ${siteUrl}` : ''}
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Vielen Dank für Ihren Fragebogen!</h2>
        
        <p>Liebe/r ${clientName},</p>
        
        <p>vielen Dank, dass Sie unseren Fragebogen ausgefüllt haben!</p>
        
        <p>Wir haben Ihre Antworten erhalten und werden uns in Kürze bei Ihnen melden, um weitere Details für Ihr Fotoshooting zu besprechen.</p>
        
        <p>Bei Fragen können Sie uns jederzeit kontaktieren.</p>
        
        <p>Mit freundlichen Grüßen,<br>
        Ihr Team von ${studioName}</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          ${studioName}<br>
          ${siteUrl ? `Website: <a href="${siteUrl}">${siteUrl}</a>` : ''}
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${studioName}" <${emailSettings.fromEmail}>`,
      to: clientEmail,
      subject,
      text,
      html
    });

    console.log('Client confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending client confirmation email:', error);
    throw error;
  }
}
