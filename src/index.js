import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import registerHandler from './api/register.js';

// Enable environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create a pool for PostgreSQL connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(bodyParser.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

// Routes

// Fetch newest books
app.get('/api/newest-books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY published_date DESC LIMIT 5');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Search books
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

// Register user
app.post('/api/register', (req, res) => registerHandler(req, res));

// Serve HTML pages
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
