import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pool from '../lib/db.js';
import * as routeFactories from '../lib/routeFactories.js';
import { tv as tmdb } from '../lib/art_fetchers/tmdb.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'tv');

const router = express.Router();

routeFactories.genresRoute(pool, router);
routeFactories.datasetsRoute(pool, router, {
    'series': `SELECT series_name AS suggestion FROM series WHERE tv ORDER BY 1`
});
routeFactories.searchRoute(pool, router, {
    'genre': `SELECT genre_name AS suggestion FROM genres WHERE genre_name ILIKE $1 LIMIT 10`
});
routeFactories.postItemRoute(pool, router, '/shows/:id?', 'SELECT set_show($1, $2::jsonb)', THUMBNAILS_DIR);
routeFactories.artFetcherRoute(router, tmdb);

router.get('/stats', async function (req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT
                 COUNT(*) AS total,
                 COUNT(*) FILTER (WHERE bookmark = 'Finished') AS done,
                 COUNT(*) FILTER (WHERE bookmark != 'Finished') AS todo
             FROM show_series_detailed`
        );
        res.json(stats.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/shows', async function(req, res, next) {
    try {
        const sql = `
            WITH seasons AS (
                SELECT show_id, season, jsonb_agg(
                           jsonb_build_object(
                               'episode', episode,
                               'watched', watched
                           )
                           ORDER BY episode
                       ) AS episodes
                FROM episodes
                GROUP BY show_id, season
            ), seasons_agg AS (
              SELECT show_id, jsonb_agg(
                         jsonb_build_object(
                             'season', season,
                             'episodes', episodes
                         )
                         ORDER BY season
                     ) AS breakdown
              FROM seasons
              GROUP BY show_id
            )
            SELECT *
            FROM show_series_detailed
            LEFT JOIN seasons_agg USING(show_id)
        `;
        const shows = await pool.query(sql);
        res.json(shows.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/shows/:id?/episodes', async function (req, res, next) {
    let id = req.params.id ?? null;
    try {
        const result = await pool.query('SELECT set_show_episodes($1, $2::jsonb) AS id', [id, JSON.stringify(req.body)]);
        res.json({ success: true });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
