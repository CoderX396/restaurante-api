const { body, param } = require('express-validator');

const idRule = [param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero')];

const createCategoryRules = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 80 }),
  body('description').optional().trim().isLength({ max: 255 }),
];

const updateCategoryRules = [
  ...idRule,
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío').isLength({ max: 80 }),
  body('description').optional().trim().isLength({ max: 255 }),
];

module.exports = { idRule, createCategoryRules, updateCategoryRules };
