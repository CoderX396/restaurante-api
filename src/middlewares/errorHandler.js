const AppError = require('../utils/AppError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'SequelizeUniqueConstraintError') {
    error = new AppError('Ya existe un registro con ese valor', 409);
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = new AppError('El registro relacionado no existe o está en uso', 409);
  } else if (err.name === 'SequelizeValidationError') {
    error = new AppError('Datos inválidos', 400, err.errors.map((e) => e.message));
  } else if (!(err instanceof AppError)) {
    console.error(err);
    error = new AppError('Error interno del servidor', 500);
  }

  const respuesta = { status: 'error', message: error.message };
  if (error.details) respuesta.details = error.details;

  res.status(error.statusCode).json(respuesta);
};

module.exports = errorHandler;
