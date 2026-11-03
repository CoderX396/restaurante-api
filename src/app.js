require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const requestTimer = require('./middlewares/requestTimer');
const { apiLimiter } = require('./middlewares/rateLimiters');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Orden: seguridad primero, luego CORS, registro y lectura del cuerpo.
app.use(helmet());
app.use(cors());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(express.json());
app.use(requestTimer);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
});

app.use('/api', apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
