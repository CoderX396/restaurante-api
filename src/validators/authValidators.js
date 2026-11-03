const { body } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = { registerRules, loginRules };
