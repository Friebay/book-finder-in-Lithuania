const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/newest-books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY published_date DESC LIMIT 5');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/search-books', async (req, res) => {
    const { query } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1',
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});
