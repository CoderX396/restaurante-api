const AppError = require('../utils/AppError');

// Uso: checkRole('admin') o checkRole('admin', 'mesero')
const checkRole =
  (...rolesPermitidos) =>
  (req, res, next) => {
    if (!req.user) return next(new AppError('No autenticado', 401));
    if (!rolesPermitidos.includes(req.user.role)) {
      return next(new AppError('No tiene permiso para realizar esta acción', 403));
    }
    return next();
  };

module.exports = checkRole;
