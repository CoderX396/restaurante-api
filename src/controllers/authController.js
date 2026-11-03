const bcrypt = require('bcrypt');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const { generarToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existe = await User.findOne({ where: { email } });
  if (existe) throw new AppError('Ya existe una cuenta con ese correo', 409);

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  // El rol nunca se toma del body: toda cuenta nueva es "mesero".
  const user = await User.create({ name, email, password: hash, role: 'mesero' });

  res.status(201).json({
    status: 'success',
    token: generarToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.scope('conPassword').findOne({ where: { email } });
  const coincide = user ? await bcrypt.compare(password, user.password) : false;
  if (!coincide) throw new AppError('Correo o contraseña incorrectos', 401);

  res.json({
    status: 'success',
    token: generarToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

const me = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) throw new AppError('Usuario no encontrado', 404);
  res.json({ status: 'success', user });
};

module.exports = { register, login, me };
