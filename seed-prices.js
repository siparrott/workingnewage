const { Client } = require('pg');
const c = new Client('postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');

const items = [
  // PRINTS
  { name: '15 x 10cm Print', description: 'Einzelner Fotodruck 15 x 10cm', category: 'PRINTS', price: '35.00', unit: 'piece' },
  { name: '10er 15 x 10cm + Geschenkbox', description: '10 Fotodrucke 15 x 10cm + elegante Geschenkbox', category: 'PRINTS', price: '300.00', unit: 'package' },
  { name: '20 x 30cm (A4) Print', description: 'Fotodruck 20 x 30cm im A4 Format', category: 'PRINTS', price: '59.00', unit: 'piece' },
  { name: '30 x 40cm (A3) Print', description: 'Fotodruck 30 x 40cm im A3 Format', category: 'PRINTS', price: '79.00', unit: 'piece' },

  // LEINWAND (Canvas)
  { name: 'Leinwand 30 x 20cm (A4)', description: 'Hochwertige Leinwand im A4 Format - kostenlose Versand', category: 'LEINWAND', price: '75.00', unit: 'piece' },
  { name: 'Leinwand 40 x 30cm (A3)', description: 'Hochwertige Leinwand im A3 Format - kostenlose Versand', category: 'LEINWAND', price: '105.00', unit: 'piece' },
  { name: 'Leinwand 60 x 40cm (A2)', description: 'Hochwertige Leinwand im A2 Format - kostenlose Versand', category: 'LEINWAND', price: '145.00', unit: 'piece' },
  { name: 'Leinwand 70 x 50cm', description: 'Grossformat Leinwand 70 x 50cm - kostenlose Versand', category: 'LEINWAND', price: '185.00', unit: 'piece' },

  // LUXUSRAHMEN (Luxury Frames)
  { name: 'A2 Leinwand in schwarzem Holzrahmen', description: 'A2 (60 x 40cm) Leinwand in elegantem schwarzem Holzrahmen', category: 'LUXUSRAHMEN', price: '199.00', unit: 'piece' },
  { name: '40 x 40cm Bildrahmen', description: 'Premium Bildrahmen 40 x 40cm', category: 'LUXUSRAHMEN', price: '145.00', unit: 'piece' },

  // DIGITAL
  { name: '1 Digitales Bild', description: '1 hochaufgeloestes digitales Foto', category: 'DIGITAL', price: '95.00', unit: 'photo' },
  { name: '10x Digitale Bilder', description: 'Paket mit 10 hochaufgeloesten digitalen Fotos', category: 'DIGITAL', price: '295.00', unit: 'package' },
  { name: '15x Digitale Bilder', description: 'Paket mit 15 hochaufgeloesten digitalen Fotos', category: 'DIGITAL', price: '365.00', unit: 'package' },
  { name: '20x Digitale Bilder', description: 'Paket mit 20 hochaufgeloesten digitalen Fotos', category: 'DIGITAL', price: '395.00', unit: 'package', notes: 'Leinwaende Format A2 & 70x50cm 1 + 1 gratis' },
  { name: '25x Digitale Bilder', description: 'Paket mit 25 hochaufgeloesten digitalen Fotos', category: 'DIGITAL', price: '445.00', unit: 'package', notes: 'Leinwaende Format A2 & 70x50cm 1 + 1 gratis' },
  { name: '30x Digitale Bilder', description: 'Paket mit 30 hochaufgeloesten digitalen Fotos', category: 'DIGITAL', price: '490.00', unit: 'package', notes: 'Leinwaende Format A2 & 70x50cm 1 + 1 gratis' },
  { name: '35x Digitale Bilder', description: 'Paket mit 35 hochaufgeloesten digitalen Fotos', category: 'DIGITAL', price: '525.00', unit: 'package', notes: 'Leinwaende Format A2 & 70x50cm 1 + 1 gratis' },
  { name: 'Alle Portraits', description: 'Komplette Sammlung aller Portraetfotos', category: 'DIGITAL', price: '595.00', unit: 'package', notes: 'Leinwaende Format A2 & 70x50cm 1 + 1 gratis' },

  // EXTRAS
  { name: 'Shooting ohne Gutschein', description: 'Fotoshooting ohne Gutschein', category: 'EXTRAS', price: '95.00', unit: 'session' },
];

async function seed() {
  await c.connect();
  
  // Check columns
  const cols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'price_list_items' ORDER BY ordinal_position");
  console.log('Columns:', cols.rows.map(r => r.column_name).join(', '));
  
  // Delete old placeholder items
  const del = await c.query('DELETE FROM price_list_items');
  console.log('Deleted old items:', del.rowCount);
  
  // Insert real items
  let inserted = 0;
  for (const item of items) {
    await c.query(
      'INSERT INTO price_list_items (name, description, category, price, currency, tax_rate, unit, notes, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [item.name, item.description, item.category, item.price, 'EUR', '20.00', item.unit, item.notes || null, true]
    );
    inserted++;
  }
  console.log('Inserted items:', inserted);
  
  // Verify
  const result = await c.query('SELECT name, category, price FROM price_list_items ORDER BY category, price');
  console.log('\nAll items:');
  for (const row of result.rows) {
    console.log(`  [${row.category}] ${row.name} - EUR ${row.price}`);
  }
  
  await c.end();
}

seed().catch(e => { console.error(e); c.end(); });
