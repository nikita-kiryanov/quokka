import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pool from '../lib/db.js';
import * as routeFactories from '../lib/routeFactories.js';
import { movies as tmdb } from '../lib/art_fetchers/tmdb.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'movies');

const router = express.Router();

routeFactories.timelineRoute(pool, router, 'movie_series_detailed');
routeFactories.genresRoute(pool, router);
routeFactories.searchRoute(pool, router, {
    'directors': `SELECT director_name AS suggestion FROM directors WHERE director_name ILIKE $1 LIMIT 10`,
    'genre': `SELECT genre_name AS suggestion FROM genres WHERE genre_name ILIKE $1 LIMIT 10`,
});
routeFactories.datasetsRoute(pool, router, {
    'series': `SELECT series_name AS suggestion FROM series WHERE movies ORDER BY 1`,
    'movies': `SELECT movie_name || ' (' || EXTRACT (year FROM initial_release_date) || ')' AS suggestion
               FROM movies
               ORDER BY 1`
});
routeFactories.postItemRoute(pool, router, '/movies/:id?', 'SELECT set_movie($1, $2::jsonb)', THUMBNAILS_DIR);
routeFactories.artFetcherRoute(router, tmdb);

router.get('/stats', async function (req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT
                 COUNT(*) AS total,
                 COUNT(*) FILTER (WHERE watched) AS done,
                 COUNT(*) FILTER (WHERE NOT watched) AS todo
             FROM movie_series_detailed`
        );
        res.json(stats.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/movies', async function(req, res, next) {
    try {
        const sql = 'SELECT * FROM movie_series_detailed';
        const movies = await pool.query(sql);
        let moviesBySeries = {};
        movies.rows.forEach(movie => {
            const series = movie.series_name || 'Not A Series';

            if (!moviesBySeries[series])
                moviesBySeries[series] = [];

            moviesBySeries[series].push(movie);
        });
        res.json(moviesBySeries);
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

export default router;
