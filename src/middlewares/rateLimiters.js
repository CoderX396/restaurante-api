const rateLimit = require('express-rate-limit');

const enPruebas = process.env.NODE_ENV === 'test';

// Límite general para las rutas de la API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => enPruebas,
  message: { status: 'error', message: 'Demasiadas peticiones. Intente más tarde.' },
});

// Límite más estricto para login y registro.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => enPruebas,
  message: { status: 'error', message: 'Demasiados intentos. Intente en 15 minutos.' },
});

module.exports = { apiLimiter, authLimiter };
