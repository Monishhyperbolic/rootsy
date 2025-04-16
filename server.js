const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306 // default for MySQL
});

app.get('/', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      res.status(500).send('Error connecting to the database');
    } else {
      res.status(200).json(results); // Send the results as JSON
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
