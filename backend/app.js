import './lib/env.js';
import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import computerGamesRouter from './routes/computer-games.js';
import moviesRouter from './routes/movies.js';
import booksRouter from './routes/books.js';
import tvRouter from './routes/tv.js';
import hotSaucesRouter from './routes/hot-sauces.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('etag');
app.set('trust proxy', 1);

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
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));
const isProduction = app.get('env') === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 400 * 24 * 60 * 60 * 1000 }
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

app.use(express.static(path.join(__dirname, '../frontend/dist'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
            res.set('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

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
app.use('/books', booksRouter);
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
