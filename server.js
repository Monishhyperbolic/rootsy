const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Create the express app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());  // To handle JSON data in requests

// MySQL connection setup using environment variables
const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, // e.g., IP or host name of your Cloud SQL
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
});

// Connect to MySQL DB
db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    process.exit(1);  // Exit the process if connection fails
  }
  console.log('Connected to MySQL DB');
});

// Basic route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to RootsY!');
});

// Get all or filtered products (based on query parameter)
app.get('/api/products', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  // Construct the SQL query with possible filters
  let sql = 'SELECT * FROM products WHERE 1=1'; // Start with a query that always returns true

  // Apply category filter if available
  if (category) {
    sql += ' AND category = ?';
  }

  // Apply price range filters if available
  if (minPrice) {
    sql += ' AND price >= ?';
  }
  if (maxPrice) {
    sql += ' AND price <= ?';
  }

  // Prepare query parameters
  const params = [];
  if (category) params.push(category);
  if (minPrice) params.push(minPrice);
  if (maxPrice) params.push(maxPrice);

  // Execute the query
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a single product by ID
app.get('/api/product/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);  // Return the first (and only) product
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
