require('dotenv').config();
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  // Delete fake test image
  const deleteResult = await p.query("DELETE FROM gallery_images WHERE url LIKE '%sample.jpg'");
  console.log('Deleted', deleteResult.rowCount, 'test rows with fake URLs');
  
  await p.end();
}

check().catch(console.error);
