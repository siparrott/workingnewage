import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function createPrintOrdersTable() {
  try {
    // Create print_orders table to track Prodigi orders
    await pool.query(`
      CREATE TABLE IF NOT EXISTS print_orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        gallery_id UUID REFERENCES galleries(id),
        gallery_image_id UUID REFERENCES gallery_images(id),
        prodigi_order_id VARCHAR(50),
        merchant_reference VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        
        -- Customer details
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        
        -- Shipping address
        shipping_line1 VARCHAR(255) NOT NULL,
        shipping_line2 VARCHAR(255),
        shipping_city VARCHAR(100) NOT NULL,
        shipping_state VARCHAR(100),
        shipping_postal_code VARCHAR(20) NOT NULL,
        shipping_country_code VARCHAR(2) NOT NULL,
        
        -- Product details
        sku VARCHAR(100) NOT NULL,
        product_name VARCHAR(255),
        copies INTEGER DEFAULT 1,
        sizing VARCHAR(50) DEFAULT 'fillPrintArea',
        attributes JSONB,
        
        -- Image URL (the gallery image to print)
        image_url TEXT NOT NULL,
        
        -- Pricing
        item_cost DECIMAL(10, 2),
        shipping_cost DECIMAL(10, 2),
        total_cost DECIMAL(10, 2),
        currency VARCHAR(3) DEFAULT 'EUR',
        
        -- Shipping method
        shipping_method VARCHAR(50) DEFAULT 'Standard',
        
        -- Tracking
        tracking_url TEXT,
        tracking_number VARCHAR(100),
        carrier VARCHAR(100),
        
        -- Prodigi response data
        prodigi_response JSONB,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        shipped_at TIMESTAMP,
        completed_at TIMESTAMP
      );
    `);
    console.log('✅ Created print_orders table');

    // Create index for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_print_orders_gallery ON print_orders(gallery_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_print_orders_prodigi ON print_orders(prodigi_order_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_print_orders_status ON print_orders(status);
    `);
    console.log('✅ Created indexes');

    // Create print_products table to cache available products
    await pool.query(`
      CREATE TABLE IF NOT EXISTS print_products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sku VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        width_inches DECIMAL(10, 2),
        height_inches DECIMAL(10, 2),
        base_price DECIMAL(10, 2),
        currency VARCHAR(3) DEFAULT 'EUR',
        attributes JSONB,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created print_products table');

    // Insert popular print products
    const products = [
      // Photo Prints
      { sku: 'GLOBAL-PHO-4X6', name: '4x6" Photo Print', category: 'prints', width: 4, height: 6, price: 2.50 },
      { sku: 'GLOBAL-PHO-5X7', name: '5x7" Photo Print', category: 'prints', width: 5, height: 7, price: 3.50 },
      { sku: 'GLOBAL-PHO-8X10', name: '8x10" Photo Print', category: 'prints', width: 8, height: 10, price: 5.00 },
      { sku: 'GLOBAL-PHO-8X12', name: '8x12" Photo Print', category: 'prints', width: 8, height: 12, price: 6.00 },
      { sku: 'GLOBAL-PHO-10X15', name: '10x15" Photo Print', category: 'prints', width: 10, height: 15, price: 8.00 },
      { sku: 'GLOBAL-PHO-12X16', name: '12x16" Photo Print', category: 'prints', width: 12, height: 16, price: 12.00 },
      { sku: 'GLOBAL-PHO-16X20', name: '16x20" Photo Print', category: 'prints', width: 16, height: 20, price: 18.00 },
      
      // Canvas Prints
      { sku: 'GLOBAL-CAN-8X8', name: '8x8" Canvas Print', category: 'canvas', width: 8, height: 8, price: 25.00 },
      { sku: 'GLOBAL-CAN-10X10', name: '10x10" Canvas Print', category: 'canvas', width: 10, height: 10, price: 30.00 },
      { sku: 'GLOBAL-CAN-12X12', name: '12x12" Canvas Print', category: 'canvas', width: 12, height: 12, price: 35.00 },
      { sku: 'GLOBAL-CAN-16X16', name: '16x16" Canvas Print', category: 'canvas', width: 16, height: 16, price: 45.00 },
      { sku: 'GLOBAL-CAN-16X20', name: '16x20" Canvas Print', category: 'canvas', width: 16, height: 20, price: 50.00 },
      { sku: 'GLOBAL-CAN-20X30', name: '20x30" Canvas Print', category: 'canvas', width: 20, height: 30, price: 75.00 },
      
      // Framed Prints
      { sku: 'GLOBAL-CFPM-8X10', name: '8x10" Framed Print', category: 'framed', width: 8, height: 10, price: 35.00 },
      { sku: 'GLOBAL-CFPM-12X16', name: '12x16" Framed Print', category: 'framed', width: 12, height: 16, price: 55.00 },
      { sku: 'GLOBAL-CFPM-16X20', name: '16x20" Framed Print', category: 'framed', width: 16, height: 20, price: 75.00 },
      { sku: 'GLOBAL-CFPM-20X30', name: '20x30" Framed Print', category: 'framed', width: 20, height: 30, price: 120.00 },
      
      // Fine Art Prints
      { sku: 'GLOBAL-FAP-8X10', name: '8x10" Fine Art Print', category: 'fine-art', width: 8, height: 10, price: 20.00 },
      { sku: 'GLOBAL-FAP-12X16', name: '12x16" Fine Art Print', category: 'fine-art', width: 12, height: 16, price: 35.00 },
      { sku: 'GLOBAL-FAP-16X20', name: '16x20" Fine Art Print', category: 'fine-art', width: 16, height: 20, price: 50.00 },
    ];

    for (const product of products) {
      await pool.query(`
        INSERT INTO print_products (sku, name, category, width_inches, height_inches, base_price, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (sku) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          width_inches = EXCLUDED.width_inches,
          height_inches = EXCLUDED.height_inches,
          base_price = EXCLUDED.base_price,
          updated_at = NOW()
      `, [product.sku, product.name, product.category, product.width, product.height, product.price, products.indexOf(product)]);
    }
    console.log(`✅ Inserted ${products.length} print products`);

    console.log('\n🎉 Print orders setup complete!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

createPrintOrdersTable();
