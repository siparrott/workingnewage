// Check Family Basic product slug
import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

async function checkProduct() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    const result = await client.query(
      "SELECT id, name, slug, price FROM voucher_products WHERE name LIKE '%Family Basic%' AND is_active = true"
    );
    
    console.log('\n📋 Family Basic Products:');
    console.table(result.rows);
    
    if (result.rows.length > 0) {
      const product = result.rows[0];
      console.log('\n🔍 First product details:');
      console.log(`  Name: ${product.name}`);
      console.log(`  Slug: ${product.slug}`);
      console.log(`  Price: €${product.price}`);
      console.log(`\n✅ Expected slug for VCWIEN: 'family-basic'`);
      console.log(`   Actual slug: '${product.slug}'`);
      console.log(`   Match: ${product.slug === 'family-basic' ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   Price is 95: ${Number(product.price) === 95 ? 'YES ✅' : `NO ❌ (${product.price})`}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkProduct().catch(console.error);

