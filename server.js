const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Create connection using Railway MySQL ENV VARS
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to Railway MySQL database');
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all products or filter by category
app.get('/api/products', (req, res) => {
  const { category_id, min_price, max_price } = req.query;
  let sql = 'SELECT * FROM products WHERE 1';
  const params = [];

  if (category_id) {
    sql += ' AND category_id = ?';
    params.push(category_id);
  }

  if (min_price) {
    sql += ' AND price >= ?';
    params.push(min_price);
  }

  if (max_price) {
    sql += ' AND price <= ?';
    params.push(max_price);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get single product by ID
app.get('/api/product/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
