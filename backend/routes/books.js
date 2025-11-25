import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pool from '../lib/db.js';
import * as routeFactories from '../lib/routeFactories.js';
import * as ol from '../lib/art_fetchers/openLibrary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'books');

const router = express.Router();

routeFactories.timelineRoute(pool, router, 'book_series_detailed');
routeFactories.searchRoute(pool, router, {
    'authors': `SELECT author_name AS suggestion FROM authors WHERE author_name ILIKE $1 LIMIT 10`,
    'genre': `SELECT book_genre_name AS suggestion FROM book_genres WHERE book_genre_name ILIKE $1 LIMIT 10`,
});
routeFactories.datasetsRoute(pool, router, {
    'series': `SELECT series_name AS suggestion FROM series WHERE books ORDER BY 1`,
    'books': `SELECT book_name || ' (' || EXTRACT (year FROM release_date) || ')' AS suggestion
              FROM books
              ORDER BY 1`
});
routeFactories.artFetcherRoute(router, ol);
routeFactories.postItemRoute(pool, router, '/books/:id?', 'SELECT set_book($1, $2::jsonb)', THUMBNAILS_DIR);

router.get('/stats', async function (req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT
                 COUNT(*) AS total,
                 COUNT(*) FILTER (WHERE read) AS done,
                 COUNT(*) FILTER (WHERE NOT read) AS todo
             FROM book_series_detailed`
        );
        res.json(stats.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/genres', async function(req, res, next) {
    try {
        const genres = await pool.query(
            `SELECT book_genre_name AS primary, NULL AS secondary
             FROM book_genres
             ORDER BY 1, 2 NULLS FIRST`
        );
        res.json({ 'genres': genres.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/books', async function(req, res, next) {
    try {
        const sql = 'SELECT * FROM book_series_detailed';
        const books = await pool.query(sql);
        let booksBySeries = {};
        books.rows.forEach(book => {
            const series = book.series || 'Not A Series';

            if (!booksBySeries[series])
                booksBySeries[series] = [];

            booksBySeries[series].push(book);
        });
        res.json(booksBySeries);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
