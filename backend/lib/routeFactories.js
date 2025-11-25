import path from 'node:path';
import sharp from 'sharp';

export function artFetcherRoute(router, fetcher) {
    router.get('/art/:searchTerm', async function (req, res, next) {
        try {
            const searchTerm = req.params.searchTerm ?? null;
            const posters = await fetcher.findPosters(searchTerm);
            res.json(posters);
        } catch (err) {
            console.error('Art fetch error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

export function timelineRoute(pool, router, view) {
    router.get('/timeline', async function (req, res, next) {
        try {
            const stats = await pool.query(
                `SELECT EXTRACT(year FROM release_date) AS year, COUNT(*) AS count,
                        MAX(COUNT(*)) OVER () AS max_count
                 FROM ${view}
                 WHERE release_date IS NOT NULL
                 GROUP BY EXTRACT(year FROM release_date)
                 ORDER BY 1`
            );
            res.json(stats.rows);
        } catch (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}

export function datasetsRoute(pool, router, spec) {
    router.get('/dataset/:what', async function (req, res, next) {
        let sql = '';
        if (spec[req.params.what]) {
            sql = spec[req.params.what];
        } else {
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
}

export function searchRoute(pool, router, spec) {
    router.get('/search/:what', async function (req, res, next) {
        const input = req.query.input;
        let sql = '';
        if (spec[req.params.what]) {
            sql = spec[req.params.what];
        } else {
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
}

export function genresRoute(pool, router) {
    router.get('/genres', async function (req, res, next) {
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
}

export function postItemRoute(pool, router, routePath, query, thumbnailPath) {
    router.post(routePath, async function (req, res, next) {
        let id = req.params.id ?? null;
        try {
            const result = await pool.query(query, [id, JSON.stringify(req.body)]);
            id = Object.values(result.rows[0])[0];
            if (req.body.thumbnail) {
                const res = await fetch(req.body.thumbnail);
                if (res.ok) {
                    const buffer = Buffer.from(await res.arrayBuffer());
                    const outputPath = path.join(thumbnailPath, `${id}.webp`);
                    await sharp(buffer).resize(170, 256, {
                        fit: 'contain',
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    }).webp({ quality: 100 }).toFile(outputPath);
                }
            }
            res.json({ success: true });
        } catch (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}