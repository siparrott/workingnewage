const { Pool } = require('@neondatabase/serverless');
const p = new Pool({ connectionString: 'postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require' });

(async () => {
  const r1 = await p.query("UPDATE blog_posts SET status='PUBLISHED' WHERE published=true AND published_at<=NOW()");
  console.log('Set PUBLISHED:', r1.rowCount, 'rows');
  
  const r2 = await p.query("UPDATE blog_posts SET status='SCHEDULED' WHERE published=true AND published_at>NOW()");
  console.log('Set SCHEDULED:', r2.rowCount, 'rows');
  
  const r3 = await p.query("UPDATE blog_posts SET status='DRAFT' WHERE published=false");
  console.log('Set DRAFT:', r3.rowCount, 'rows');
  
  const check = await p.query('SELECT status, COUNT(*) as cnt FROM blog_posts GROUP BY status ORDER BY status');
  console.table(check.rows);
  
  await p.end();
})();
