import express from 'express';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pool from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'games');

const router = express.Router();

router.get('/stats', async function(req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT
                 COUNT(*) AS total_games,
                 COUNT(*) FILTER (WHERE played) AS played_games,
                 COUNT(*) FILTER (WHERE NOT played) AS unplayed_games
             FROM game_series_detailed`
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
            `SELECT EXTRACT(year FROM initial_release_date) AS year, COUNT(*) AS count,
                            MAX(COUNT(*)) OVER () AS max_count
             FROM game_series_detailed
             WHERE dlc_for IS NULL
             GROUP BY EXTRACT(year FROM initial_release_date)
             ORDER BY 1`
        );
        res.json(stats.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/developer-info', async function (req, res, next) {
    try {
        const stats = await pool.query(
            `SELECT info FROM developers WHERE developer_name = $1`, [req.query.name]
        );
        res.json(stats.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/games', async function(req, res, next) {
    try {
        const sql = `
            WITH genre_equivalences AS (
                SELECT a.game_genre_name, array_cat(
                    ARRAY_AGG(b.game_genre_name) FILTER (WHERE b.game_genre_name IS NOT NULL),
                    ARRAY[a.game_genre_name]
                ) AS equivs
                FROM game_genres a
                LEFT JOIN game_genres b ON a.game_genre_name = b.parent
                GROUP BY a.game_genre_name
                ORDER BY a.game_genre_name
            ), developer_equivalences AS (
                SELECT ARRAY_AGG(developer_name) AS equivs
                FROM developers
                GROUP BY equivalency_group
                ORDER BY equivalency_group
            )
            SELECT a.*, bool_and(a.played) OVER(PARTITION BY COALESCE(a.dlc_for, a.game_id)) AS dlcs_played,
                        b.game_name || ' (' || EXTRACT(year FROM b.initial_release_date) || ')' AS dlc_for_name,
                        c.game_name || ' (' || EXTRACT(year FROM c.initial_release_date) || ')' AS remake_for_name
            FROM (
                SELECT (ROW_NUMBER() OVER())::integer AS sort_order, *
                FROM game_series_detailed
            ) a
            LEFT JOIN games b ON a.dlc_for = b.game_id
            LEFT JOIN games c ON a.remake_for = c.game_id
            ORDER BY sort_order`;

        const games = await pool.query(sql);
        let gamesByFranchise = {};
        games.rows.forEach(game => {
            // Standalone series get their own franchise key equal to their series name. This
            // matches the view's `ORDER BY COALESCE(franchise, series)`, so they sort
            // into their correct alphabetical position on the frontend.
            const franchise = game.franchise || game.series;
            const series = game.series || 'Not A Series';

            if (!gamesByFranchise[franchise]) gamesByFranchise[franchise] = {};
            if (!gamesByFranchise[franchise][series]) gamesByFranchise[franchise][series] = [];

            gamesByFranchise[franchise][series].push(game);
        });
        res.json(gamesByFranchise);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/games/:id?', async function(req, res, next) {
    let id = req.params.id ?? null;
    try {
        const result = await pool.query('SELECT set_game($1, $2::jsonb) AS id', [id, JSON.stringify(req.body)]);
        id = result.rows[0].id;
        if (req.body.thumbnail) {
            const res = await fetch(req.body.thumbnail);
            if (res.ok) {
                const buffer = Buffer.from(await res.arrayBuffer());
                const outputPath = path.join(THUMBNAILS_DIR, `${id}.png`);
                await sharp(buffer).resize(170, 256, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                }).png().toFile(outputPath);
            }
        }
        res.json({ success: true });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/genres', async function(req, res, next) {
    try {
        const genres = await pool.query(
            `WITH primary_ AS (
                    SELECT game_genre_name
                    FROM game_genres
                    WHERE parent IS NULL
             )
             SELECT primary_.game_genre_name AS primary, secondary.game_genre_name AS secondary
             FROM primary_
             LEFT JOIN game_genres secondary ON parent = primary_.game_genre_name
             UNION
             SELECT game_genre_name, NULL
             FROM primary_
             ORDER BY 1, 2 NULLS FIRST`
        );
        res.json({ 'genres': genres.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/todo', async function(req, res, next) {
    try {
        const lists = await pool.query(
            `SELECT list_name AS name, list_item_type AS type, list_item AS item
             FROM lists
             WHERE type = 'Computer Games'
             ORDER BY list_name, sort`
        );
        const retval = {};
        for (const row of lists.rows) {
            if (!retval[row.name]) retval[row.name] = [];
            retval[row.name].push({ type: row.type, item: row.item });
        }
        res.json({ 'lists': retval });
    }
    catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/search/:what', async function (req, res, next) {
    const input = req.query.input;
    let sql = '';
    switch (req.params.what) {
        case 'developer':
            sql = `SELECT developer_name AS suggestion FROM developers WHERE developer_name ILIKE $1 LIMIT 10`;
            break;
        case 'content':
            sql = `SELECT content_genre_name AS suggestion FROM content_genres WHERE content_genre_name ILIKE $1 LIMIT 10`;
            break;
        case 'genre':
            sql = `SELECT game_genre_name AS suggestion FROM game_genres WHERE game_genre_name ILIKE $1 LIMIT 10`;
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
            sql = `SELECT series_name AS suggestion FROM series WHERE computer_games ORDER BY 1`;
            break;
        case 'franchise':
            sql = `SELECT franchise_name AS suggestion FROM franchise ORDER BY 1`;
            break;
        case 'games':
            sql = `SELECT game_name || ' (' || EXTRACT (year FROM initial_release_date) || ')' AS suggestion
                   FROM games
                   ORDER BY 1`;
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
