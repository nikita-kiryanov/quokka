import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pool from '../lib/db.js';
import * as routeFactories from '../lib/routeFactories.js';
import * as noop from '../lib/art_fetchers/noop.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'sauces');

const router = express.Router();

routeFactories.datasetsRoute(pool, router, {
    'brand': `SELECT brand_name AS suggestion FROM brand ORDER BY 1`
});
routeFactories.searchRoute(pool, router, {
    'pepper': `SELECT pepper_name AS suggestion FROM peppers WHERE pepper_name ILIKE $1 LIMIT 10`
});
routeFactories.postItemRoute(pool, router, '/hot-sauces/:id?', 'SELECT set_sauce($1, $2::jsonb)', THUMBNAILS_DIR);
routeFactories.artFetcherRoute(router, noop);

router.get('/sauces', async function(req, res, next) {
    try {
        const sql = 'SELECT * FROM sauce_brands_detailed';
        const sauces = await pool.query(sql);
        let saucesByBrand = {};
        sauces.rows.forEach(sauce => {
            if (!saucesByBrand[sauce.brand])
                saucesByBrand[sauce.brand] = [];

            saucesByBrand[sauce.brand].push(sauce);
        });
        res.json(saucesByBrand);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/peppers', async function (req, res, next) {
    try {
        const peppers = await pool.query(
            `SELECT pepper_name AS primary, NULL AS secondary
             FROM peppers
             ORDER BY max_shu ASC, pepper_name ASC`
        );
        res.json({ 'genres': peppers.rows });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
