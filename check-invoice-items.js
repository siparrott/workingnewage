require('dotenv').config();
const neon = require('@neondatabase/serverless');
const { neonConfig } = neon;
neonConfig.fetchConnectionCache = true;
const sql = neon.neon(process.env.DATABASE_URL);

(async () => {
  try {
    // Check all price list items
    const items = await sql`SELECT name, LEFT(description, 100) as desc_preview, LENGTH(description) as desc_length FROM price_list_items WHERE is_active = true ORDER BY LENGTH(description) DESC LIMIT 10`;
    console.log('Price list items by description length:');
    items.forEach(item => {
      console.log(`- ${item.name}: ${item.desc_length} chars - "${item.desc_preview}..."`);
    });
    
  } catch (e) {
    console.log('Error:', e.message);
  }
})();
