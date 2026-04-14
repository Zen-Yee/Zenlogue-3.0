import pg from 'pg';
const { Pool } = pg;

// Create a single connection pool instance
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // required for Railway and many managed hosts
  },
});

// Optional: simple connection test on startup
db.connect()
  .then(client => {
    console.log('Connected to PostgreSQL');
    client.release();
  })
  .catch(err => console.error('Database connection error:', err.stack));

// Export db pool so other modules can use it
export default db;
