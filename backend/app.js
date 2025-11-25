import './env.js';
import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import computerGamesRouter from './routes/computer-games.js';
import moviesRouter from './routes/movies.js';
import tvRouter from './routes/tv.js';
import hotSaucesRouter from './routes/hot-sauces.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('etag');

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) return next();
    try {
        const { hostname } = new URL(origin);
        const isLocal = hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
        if (isLocal) {
            res.set('Access-Control-Allow-Origin', origin);
            res.set('Access-Control-Allow-Credentials', 'true');
            res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
            if (req.method === 'OPTIONS') return res.sendStatus(204);
        }
    } catch {}
    next();
});
app.use(logger('dev'));
app.use((req, res, next) => {
    const isGameThumbnailUpload = req.method === 'POST' && /^\/computer-games\/games(\/\d+)?$/.test(req.path);
    express.json({ limit: isGameThumbnailUpload ? '5mb' : '100kb' })(req, res, next);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 }
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.LOGIN_USERNAME && password === process.env.LOGIN_PASSWORD) {
        req.session.userId = username;
        return res.json({ ok: true });
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
});

app.get('/auth/me', (req, res) => {
    res.json({ username: req.session.userId || null });
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use('/sgdb', async (req, res) => {
    const url = `https://www.steamgriddb.com/api/v2${req.url}`;
    const resp = await fetch(url, { headers: { Authorization: req.headers.authorization } });
    res.status(resp.status);
    resp.headers.forEach((value, key) => {
        if (key !== 'content-encoding' && key !== 'transfer-encoding') res.set(key, value);
    });
    const buffer = Buffer.from(await resp.arrayBuffer());
    res.send(buffer);
});

app.use('/tmdb', async (req, res) => {
    const url = `https://api.themoviedb.org/3${req.url}`;
    const resp = await fetch(url, { headers: { Authorization: req.headers.authorization } });
    res.status(resp.status);
    resp.headers.forEach((value, key) => {
        if (key !== 'content-encoding' && key !== 'transfer-encoding') res.set(key, value);
    });
    const buffer = Buffer.from(await resp.arrayBuffer());
    res.send(buffer);
});

app.use((req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    next();
});

app.use('/', indexRouter);
app.use('/computer-games', computerGamesRouter);
app.use('/movies', moviesRouter);
app.use('/tv', tvRouter);
app.use('/hot-sauces', hotSaucesRouter);

// SPA catch-all: serves index.html for any unmatched route (client-side routing)
app.get('*', (req, res, next) => {
    if (req.accepts('html')) {
        return res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

export default app;
