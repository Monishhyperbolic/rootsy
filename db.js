const { Pool } = require('pg');

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString:postgresql://postgres:123456@db.takraoqafzlolecjgtgn.supabase.co:5432/postgres,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
