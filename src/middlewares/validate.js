const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Se coloca después de las reglas de express-validator en cada ruta.
const validate = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const details = errores.array().map((e) => ({ campo: e.path, mensaje: e.msg }));
    return next(new AppError('Datos inválidos', 400, details));
  }
  return next();
};

module.exports = validate;
