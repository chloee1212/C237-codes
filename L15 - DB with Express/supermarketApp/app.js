const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RP738964$',
    database: 'c237_supermarketapp'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Enable form processing
app.use(express.urlencoded({ extended: false }));

// Home page route
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error Retrieving products');
        }

        res.render('index', { products: results });
    });
});

// Display a single product
app.get('/product/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'SELECT * FROM products WHERE productId = ?';

    connection.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error Retrieving product');
        }

        if (results.length > 0) {
            res.render('product', { product: results[0] });
        } else {
            res.send('Product not found');
        }
    });
});

// Display Add Product page
app.get('/addProduct', (req, res) => {
    res.render('addProduct');
});

// Handle Add Product form submission
app.post('/addProduct', (req, res) => {
    const { name, quantity, price, image } = req.body;

    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';

    connection.query(sql, [name, quantity, price, image], (error, results) => {
        if (error) {
            console.error('Error adding product:', error);
            return res.send('Error adding product');
        }

        res.redirect('/');
    });
});

// Display Edit Product page and handle Edit Product form submission based on the product ID

app.get('/editProduct/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    // Fetch data from MySQL based on the product ID
    connection.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving product by ID');
        }
        // Check if any product with the given ID was found
        if (results.length > 0) {
            // Render HTML page with the product data
            res.render('editProduct', { product: results[0] });
        } else {
            // If no product with the given ID was found, render a 404 page or handle it accordingly
            res.send('Product not found');
        }
    });
});


app.post('/editProduct/:id', (req, res) => {
    const productId = req.params.id;
    // Extract product data from the request body
    const { name, quantity, price } = req.body;
    const sql = 'UPDATE products SET productName = ? , quantity = ?, price = ? WHERE productId = ?';
    // Insert the new product into the database
    connection.query(sql, [name, quantity, price, productId], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error updating product:", error);
            res.send('Error updating product');
        } else {
            // Send a success response
            res.redirect('/');
        }
    });
});

app.get('/deleteProduct/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE productId = ?';
  connection.query( sql , [productId], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error deleting product:", error);
      res.send('Error deleting product');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});