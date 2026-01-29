require('dotenv').config();
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  // Check galleries that have images
  const galleriesWithImages = await p.query(`
    SELECT g.id, g.title, g.slug, COUNT(gi.id) as image_count
    FROM galleries g
    LEFT JOIN gallery_images gi ON g.id = gi.gallery_id
    GROUP BY g.id, g.title, g.slug
    HAVING COUNT(gi.id) > 0
    ORDER BY COUNT(gi.id) DESC
    LIMIT 5
  `);
  
  console.log('Galleries with images:');
  for (const gallery of galleriesWithImages.rows) {
    console.log(`\n${gallery.title} (${gallery.slug}): ${gallery.image_count} images`);
    console.log(`  Edit URL: /admin/galleries/${gallery.id}/edit`);
    
    // Get first image URL
    const firstImage = await p.query('SELECT filename, url FROM gallery_images WHERE gallery_id = $1 LIMIT 1', [gallery.id]);
    if (firstImage.rows[0]) {
      console.log(`  Sample image: ${firstImage.rows[0].url}`);
    }
  }
  
  await p.end();
}

check().catch(console.error);
