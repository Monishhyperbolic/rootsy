const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: '34.56.197.58',
  user: 'rootsy',
  password: 'your-db-password',
  database: 'your-db-name',
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
