const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('✅ API is running. Try /api/categories or /api/products');
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No categories found' });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single category by ID (optional)
app.get('/api/category/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products with optional filtering (category_id, min_price, max_price)
app.get('/api/products', async (req, res) => {
  const { category_id, min_price, max_price } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category_id) {
    sql += ' AND category_id = $1';
    params.push(category_id);
  }

  if (min_price) {
    sql += ` AND price >= $${params.length + 1}`;
    params.push(min_price);
  }

  if (max_price) {
    sql += ` AND price <= $${params.length + 1}`;
    params.push(max_price);
  }

  try {
    const result = await pool.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }
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

// Add a new category
app.post('/api/categories', async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  const { name, image_url, price, category_id, description, model_url } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, image_url, price, category_id, description, model_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, image_url, price, category_id, description, model_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
