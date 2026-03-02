const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_2sKfUx0ctHQN@ep-snowy-art-agb4ejwo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');

(async () => {
  // Get column names
  const cols = await sql("SELECT column_name FROM information_schema.columns WHERE table_name = 'photography_sessions' ORDER BY ordinal_position");
  console.log('=== Session Table Columns ===');
  console.log(cols.map(c => c.column_name).join(', '));

  // Recent Google Calendar sessions
  const gcalSessions = await sql('SELECT id, title, start_time, end_time, google_calendar_event_id, created_at FROM photography_sessions WHERE google_calendar_event_id IS NOT NULL ORDER BY created_at DESC LIMIT 10');
  console.log('\n=== Recent Google Calendar Sessions (by created_at) ===');
  gcalSessions.forEach(s => console.log(JSON.stringify(s)));

  const count = await sql('SELECT COUNT(*) as cnt FROM photography_sessions WHERE google_calendar_event_id IS NOT NULL');
  console.log('\nTotal GCal events in DB:', count[0].cnt);

  // Sessions created after the OAuth reconnection
  const recentSessions = await sql("SELECT id, title, start_time, created_at FROM photography_sessions WHERE created_at > '2026-03-02T18:10:00Z' ORDER BY created_at DESC LIMIT 10");
  console.log('\n=== Sessions created after reconnection ===');
  if (recentSessions.length === 0) console.log('(none)');
  recentSessions.forEach(s => console.log(JSON.stringify(s)));

  // Latest sync logs columns
  const logCols = await sql("SELECT column_name FROM information_schema.columns WHERE table_name = 'calendar_sync_logs' ORDER BY ordinal_position");
  console.log('\n=== Sync Log Columns ===');
  console.log(logCols.map(c => c.column_name).join(', '));

  // Latest sync logs with more detail
  const logs = await sql('SELECT * FROM calendar_sync_logs ORDER BY created_at DESC LIMIT 5');
  console.log('\n=== Latest 5 Sync Logs ===');
  logs.forEach(l => console.log(JSON.stringify(l)));
})();
