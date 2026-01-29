const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    // Check this specific gallery
    const galleryId = 'be65521a-6f21-4d89-a864-3894af02c71d';
    
    console.log('Checking gallery:', galleryId);
    
    // Get gallery info
    const galleryResult = await pool.query('SELECT id, title, slug FROM galleries WHERE id = $1', [galleryId]);
    console.log('Gallery:', galleryResult.rows[0]);
    
    // Get images for this gallery
    const imagesResult = await pool.query('SELECT id, filename, url FROM gallery_images WHERE gallery_id = $1', [galleryId]);
    console.log('Images found:', imagesResult.rows.length);
    if (imagesResult.rows.length > 0) {
      console.log('Images:', JSON.stringify(imagesResult.rows, null, 2));
    }
    
    // Also check all galleries with their image counts
    const allGalleries = await pool.query(`
      SELECT g.id, g.title, g.slug, COUNT(gi.id) as image_count 
      FROM galleries g 
      LEFT JOIN gallery_images gi ON g.id = gi.gallery_id 
      GROUP BY g.id, g.title, g.slug 
      ORDER BY image_count DESC
      LIMIT 10
    `);
    console.log('\nTop 10 galleries by image count:');
    allGalleries.rows.forEach(g => {
      console.log(`  - ${g.title}: ${g.image_count} images`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

check();
