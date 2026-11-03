const jwt = require('jsonwebtoken');

const secreto = () => process.env.JWT_SECRET || 'clave_solo_para_desarrollo';

const generarToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, secreto(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

const verificarToken = (token) => jwt.verify(token, secreto());

module.exports = { generarToken, verificarToken };
