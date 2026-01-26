const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: "postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
});

async function main() {
  try {
    // Fix the VWELT50 coupon - it should target "Family Classic" which has slug "weihnachten-family-basic"
    // Also fix VCWIEN to use the correct slug
    
    // First, let's see all products to understand the mapping
    const products = await pool.query(`
      SELECT id, name, slug FROM voucher_products ORDER BY name
    `);
    console.log('All voucher products:');
    products.rows.forEach(p => console.log(`  ${p.name} -> slug: ${p.slug}`));
    
    // Update VWELT50 to use correct slug for Family Classic
    console.log('\\nUpdating VWELT50 coupon...');
    const result1 = await pool.query(`
      UPDATE discount_coupons 
      SET applicable_products = $1
      WHERE code = 'VWELT50'
      RETURNING code, name, applicable_products
    `, [['weihnachten-family-basic']]);
    console.log('VWELT50 updated:', result1.rows[0]);
    
    // Verify the fix
    console.log('\\nVerifying coupons after fix:');
    const coupons = await pool.query(`
      SELECT code, name, applicable_products 
      FROM discount_coupons 
      WHERE code IN ('VWELT50', 'VCWIEN')
    `);
    console.log(JSON.stringify(coupons.rows, null, 2));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
