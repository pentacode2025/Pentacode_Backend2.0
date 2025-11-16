const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const { errorHandler } = require('./middleware/error.middleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

// health
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// simple API root (HTML) as requested
app.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.send('<!doctype html><html><head><meta charset="utf-8"><title>API</title></head><body><h1>Hola soy el BackEnd</h1></body></html>');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
