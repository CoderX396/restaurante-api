const { body, param, query } = require('express-validator');

const idRule = [param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero')];

const listMenuItemRules = [
  query('categoryId').optional().isInt({ min: 1 }).withMessage('categoryId debe ser un entero'),
  query('available').optional().isBoolean().withMessage('available debe ser true o false'),
];

const createMenuItemRules = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 120 }),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('available').optional().isBoolean().withMessage('available debe ser true o false'),
  body('categoryId').isInt({ min: 1 }).withMessage('categoryId es obligatorio y debe ser un entero'),
];

const updateMenuItemRules = [
  ...idRule,
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío').isLength({ max: 120 }),
  body('description').optional().trim(),
  body('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('available').optional().isBoolean().withMessage('available debe ser true o false'),
  body('categoryId').optional().isInt({ min: 1 }).withMessage('categoryId debe ser un entero'),
];

module.exports = { idRule, listMenuItemRules, createMenuItemRules, updateMenuItemRules };
