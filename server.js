const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection setup
const pool = new Pool({
  host: 'metro.proxy.rlwy.net',
  port: 5432,
  database: 'railway',
  user: 'postgres',
  password: 'kINSmvJLTbLhVXnWOlFXyllzTKVDmAIT',
  ssl: false // Set to true if required by Railway
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to Railway PostgreSQL database');
    release();
  }
});

// API to get categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// API to get products by category
app.get('/api/products', async (req, res) => {
  try {
    const categoryId = parseInt(req.query.category_id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const result = await pool.query(
      'SELECT * FROM products WHERE category_id = $1 ORDER BY name',
      [categoryId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
