import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/sauces', async function(req, res, next) {
    try {
        const sql = 'SELECT * FROM sauce_brands_detailed';
        console.log(sql);
        const sauces = await pool.query(sql);
        let saucesByBrand = {};
        sauces.rows.forEach(sauce => {
            if (!saucesByBrand[sauce.brand]) saucesByBrand[sauce.brand] = [];

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

router.get('/dataset/:what', async function (req, res, next) {
    let sql = '';
    switch (req.params.what) {
        case 'brand':
            sql = `SELECT brand_name AS suggestion FROM brand ORDER BY 1`;
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

router.get('/search/:what', async function (req, res, next) {
    const input = req.query.input;
    let sql = '';
    switch (req.params.what) {
        case 'pepper':
            sql = `SELECT pepper_name AS suggestion FROM peppers WHERE pepper_name ILIKE $1 LIMIT 10`;
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


export default router;
