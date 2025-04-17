const express = require('express');
const path = require('path');
const pool = require('./db'); // Import the database connection
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));  // Serve static files like CSS, JS

// Serve the HTML index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route to get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API route to get products based on category
app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM products';
  const params = [];

  if (category) {
    sql += ' WHERE category_id = $1';
    params.push(category);
  }

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
