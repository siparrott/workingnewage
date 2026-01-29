const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function copyImages() {
  try {
    const sourceGalleryId = 'eca7b771-f871-4fc1-8b54-2a903bd8018f'; // Nature & Landscapes (has 9 images)
    const targetGalleryId = 'be65521a-6f21-4d89-a864-3894af02c71d'; // Parrott Family (currently 0 images)
    
    console.log(`Copying images from Nature & Landscapes to Parrott Family...`);
    
    // Get images from source gallery
    const sourceImages = await pool.query(
      'SELECT filename, url, title, description, sort_order FROM gallery_images WHERE gallery_id = $1 LIMIT 3',
      [sourceGalleryId]
    );
    
    console.log(`Found ${sourceImages.rows.length} images to copy`);
    
    // Insert copies into target gallery
    for (const img of sourceImages.rows) {
      await pool.query(`
        INSERT INTO gallery_images (gallery_id, filename, url, title, description, sort_order, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [targetGalleryId, img.filename, img.url, img.title, img.description, img.sort_order]);
      console.log(`  Copied: ${img.filename}`);
    }
    
    // Verify
    const result = await pool.query('SELECT COUNT(*) as count FROM gallery_images WHERE gallery_id = $1', [targetGalleryId]);
    console.log(`\nParrott Family now has ${result.rows[0].count} images`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

copyImages();
