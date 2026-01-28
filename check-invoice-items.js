require('dotenv').config();
const neon = require('@neondatabase/serverless');
const { neonConfig } = neon;
neonConfig.fetchConnectionCache = true;
const sql = neon.neon(process.env.DATABASE_URL);

(async () => {
  try {
    // Clean up the Family Portrait item description - keep only the marketing description
    const result = await sql`
      UPDATE price_list_items 
      SET description = 'Professional family portrait session with high-quality prints included'
      WHERE name = 'Family Portrait (standard)'
      RETURNING name, description
    `;
    console.log('Updated:', JSON.stringify(result, null, 2));
    
  } catch (e) {
    console.log('Error:', e.message);
  }
})();
