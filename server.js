const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');  // Import pg Pool
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set up the PostgreSQL connection using the connection string from Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Required for Railway production databases
  }
});

app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/', (req, res) => {
  res.send('✅ API is running. Try /api/categories or /api/products');
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products with optional filtering (category_id)
app.get('/api/products', async (req, res) => {
  const { category_id } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category_id) {
    sql += ' AND category_id = $1';
    params.push(category_id);
  }

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product by ID
app.get('/api/product/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
