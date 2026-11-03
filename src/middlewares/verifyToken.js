const AppError = require('../utils/AppError');
const { verificarToken } = require('../utils/jwt');

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(new AppError('Token no proporcionado', 401));
  }

  try {
    req.user = verificarToken(token);
    return next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado', 401));
  }
};

module.exports = verifyToken;
