require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function pushDb() {
  // PowerShell '>' outputs UTF-16LE by default
  let sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf16le');
  
  if (sql.charCodeAt(0) === 0xFEFF) {
    sql = sql.slice(1);
  }
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
  }

  // Use the connection string exactly as provided, but connection_timeout might be needed
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000 
  });

  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected! Pushing schema...');
    
    // Split the bulk SQL by statements to avoid PgBouncer protocol issues with massive queries
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
      
    console.log(`Executing ${statements.length} statements...`);
    
    for (let i = 0; i < statements.length; i++) {
       try {
         await client.query(statements[i]);
       } catch (err) {
         console.error(`Error on statement ${i + 1}:`, statements[i]);
         throw err;
       }
    }
    
    console.log('Schema pushed successfully!');
    
    console.log('Schema pushed successfully!');
    await client.end();
  } catch (err) {
    console.error('Failed to push schema:', err);
    process.exit(1);
  }
}

pushDb();
