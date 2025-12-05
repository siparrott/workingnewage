// Update voucher product display order in Neon database
import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function updateProductOrder() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    console.log('🔌 Connecting to Neon database...');
    await client.connect();
    console.log('✅ Connected!');
    
    // Update Family Basic to display_order = -1 (to appear first)
    console.log('\n📝 Setting Family Basic to display_order = -1...');
    const result1 = await client.query(
      "UPDATE voucher_products SET display_order = -1 WHERE name LIKE '%Family Basic%' RETURNING name, display_order"
    );
    console.log(`✅ Updated ${result1.rowCount} product(s):`, result1.rows);
    
    // Update Eventfotografie to display_order = 100
    console.log('\n📝 Setting Eventfotografie to display_order = 100...');
    const result2 = await client.query(
      "UPDATE voucher_products SET display_order = 100 WHERE name LIKE '%Event%' RETURNING name, display_order"
    );
    console.log(`✅ Updated ${result2.rowCount} product(s):`, result2.rows);
    
    // Verify the order
    console.log('\n📋 Current product order:');
    const result3 = await client.query(
      'SELECT name, display_order, is_active FROM voucher_products WHERE is_active = true ORDER BY display_order ASC, created_at DESC LIMIT 10'
    );
    console.table(result3.rows);
    
    console.log('\n✅ Product order updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Connection closed');
  }
}

updateProductOrder().catch(console.error);

