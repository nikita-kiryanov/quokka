import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/stats', async function(req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT
                 COUNT(*) AS total_shows,
                 COUNT(*) FILTER (WHERE bookmark = 'Finished') AS watched_shows,
                 COUNT(*) FILTER (WHERE bookmark != 'Finished') AS unwatched_shows
             FROM show_series_detailed`
        );
        res.json(stats.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/tv', async function(req, res, next) {
    try {
        let i = 1;
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
        console.log(sql);
        const shows = await pool.query(sql);
        res.json(shows.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/dataset/:what', async function (req, res, next) {
    let sql = '';
    switch (req.params.what) {
        case 'series':
            sql = `SELECT series_name AS suggestion FROM series WHERE tv ORDER BY 1`;
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

router.post('/:id?/episodes', async function (req, res, next) {
    let id = req.params.id ?? null;
    try {
        const result = await pool.query('SELECT set_show_episodes($1, $2::jsonb) AS id', [id, JSON.stringify(req.body)]);
        res.json({ success: true });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:id?', async function (req, res, next) {
    let id = req.params.id ?? null;
    try {
        const result = await pool.query('SELECT set_show($1, $2::jsonb) AS id', [id, JSON.stringify(req.body)]);
        res.json({ success: true });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
