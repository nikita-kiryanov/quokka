import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/stats', async function(req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT
                 COUNT(*) AS total_movies,
                 COUNT(*) FILTER (WHERE watched) AS watched_movies,
                 COUNT(*) FILTER (WHERE NOT watched) AS unwatched_movies
             FROM movie_series_detailed`
        );
        res.json(stats.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/timeline', async function (req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT EXTRACT(year FROM release_date) AS year, COUNT(*) AS count,
                            MAX(COUNT(*)) OVER () AS max_count
             FROM movie_series_detailed
             GROUP BY EXTRACT(year FROM release_date)
             ORDER BY 1`
        );
        res.json(stats.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/movies', async function(req, res, next) {
    try {
        let i = 1;
        const sql = 'SELECT * FROM movie_series_detailed';
        console.log(sql);
        const movies = await pool.query(sql);
        let moviesBySeries = {};
        movies.rows.forEach(movie => {
            const series = movie.series_name || 'Not A Series';

            if (!moviesBySeries[series]) moviesBySeries[series] = [];

            moviesBySeries[series].push(movie);
        });
        res.json(moviesBySeries);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/genres', async function(req, res, next) {
    try {
        const genres = await pool.query(
            `SELECT genre_name AS primary, NULL AS secondary
             FROM genres
             ORDER BY 1, 2 NULLS FIRST`
        );
        res.json({ 'genres': genres.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/organization', async function(req, res, next) {
    try {
        const organization = await pool.query(
            `SELECT DISTINCT organization AS primary, NULL AS secondary
             FROM organizational_units
             ORDER BY 1, 2 NULLS FIRST`
        );
        res.json({ 'genres': organization.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/search/:what', async function (req, res, next) {
    const input = req.query.input;
    let sql = '';
    switch (req.params.what) {
        case 'directors':
            sql = `SELECT director_name AS suggestion FROM directors WHERE director_name ILIKE $1 LIMIT 10`;
            break;
        case 'genre':
            sql = `SELECT genre_name AS suggestion FROM genres WHERE genre_name ILIKE $1 LIMIT 10`;
            break;
        default:
            res.status(400).json({ error: 'Invalid search type' });
            return;
    }
    try {
        const results = await pool.query(sql, [`%${input}%`]);
        res.json(results.rows);
    }
    catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/dataset/:what', async function (req, res, next) {
    let sql = '';
    switch (req.params.what) {
        case 'series':
            sql = `SELECT series_name AS suggestion FROM series WHERE movies ORDER BY 1`;
            break;
        case 'movies':
            sql = `SELECT movie_name || ' (' || EXTRACT (year FROM initial_release_date) || ')' AS suggestion
                   FROM movies
                   ORDER BY 1`;
            break;
        default:
            res.status(400).json({ error: 'Invalid search type' });
            return;
    }
    try {
        const results = await pool.query(sql);
        res.json(results.rows);
    }
    catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
