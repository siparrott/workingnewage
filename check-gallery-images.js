require('dotenv').config();
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const galleryId = '1e616c89-ff88-4853-b173-11ee6d8419fc';
  
  console.log('Checking gallery:', galleryId);
  
  const galleryResult = await p.query('SELECT id, title, slug FROM galleries WHERE id = $1', [galleryId]);
  console.log('Gallery:', galleryResult.rows[0]);
  
  const imagesResult = await p.query('SELECT id, gallery_id, filename, url FROM gallery_images WHERE gallery_id = $1', [galleryId]);
  console.log('Images count:', imagesResult.rows.length);
  imagesResult.rows.forEach(row => console.log('  -', row.filename, row.url));
  
  await p.end();
}

check().catch(console.error);
