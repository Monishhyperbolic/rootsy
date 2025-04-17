// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves frontend HTML/CSS/JS

// Health Check
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

// Get products (with optional filtering by category_id)
app.get('/api/products', async (req, res) => {
  const { category_id } = req.query;
  try {
    let query = 'SELECT * FROM products';
    const params = [];

    if (category_id) {
      query += ' WHERE category_id = $1';
      params.push(category_id);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
app.get('/api/product/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
