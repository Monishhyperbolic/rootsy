const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,     // Google SQL public IP
  user: process.env.DB_USER,     // Your DB user
  password: process.env.DB_PASS, // Your DB password
  database: process.env.DB_NAME  // Your DB name
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL DB');
});

// Get all or filtered products
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const sql = category
    ? 'SELECT * FROM products WHERE category = ?'
    : 'SELECT * FROM products';

  db.query(sql, category ? [category] : [], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get product by ID
app.get('/api/product/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
