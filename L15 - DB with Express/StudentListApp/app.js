const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RP738964$',
    database: 'c237_studentlistapp'
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
    const sql = `
    SELECT
        studentid,
        name,
        DATE_FORMAT(dob, '%d/%m/%Y') AS dob,
        contact,
        image
    FROM student`;

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error Retrieving students');
        }

        res.render('index', { students: results });
    });
});

// Display a single student
app.get('/student/:id', (req, res) => {
    const studentid = req.params.id;

    const sql = `
    SELECT
        studentid,
        name,
        DATE_FORMAT(dob, '%d/%m/%Y') AS dob,
        contact,
        image
    FROM student
    WHERE studentid = ?`;

    connection.query(sql, [studentid], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error Retrieving student');
        }

        if (results.length > 0) {
            res.render('student', { student: results[0] });
        } else {
            res.send('Student not found');
        }
    });
});

// Display Add Student page
app.get('/addStudent', (req, res) => {
    res.render('addStudent');
});

// Handle Add Student form submission
app.post('/addStudent', (req, res) => {
    const { name, dob, contact, image } = req.body;

    const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';

    connection.query(sql, [name, dob, contact, image], (error, results) => {
        if (error) {
            console.error('Error adding student:', error);
            return res.send('Error adding student');
        }

        res.redirect('/');
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});