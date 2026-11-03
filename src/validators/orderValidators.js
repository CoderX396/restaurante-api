const { body, param } = require('express-validator');

const ESTADOS = ['pendiente', 'en_preparacion', 'servido', 'pagado', 'cancelado'];

const idRule = [param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero')];

const createOrderRules = [
  body('tableNumber').isInt({ min: 1 }).withMessage('tableNumber debe ser un entero mayor que 0'),
  body('notes').optional().trim().isLength({ max: 255 }),
  body('items').isArray({ min: 1 }).withMessage('El pedido debe tener al menos un plato'),
  body('items.*.menuItemId').isInt({ min: 1 }).withMessage('Cada plato necesita un menuItemId válido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser un entero mayor que 0'),
];

const updateStatusRules = [
  ...idRule,
  body('status').isIn(ESTADOS).withMessage(`El estado debe ser uno de: ${ESTADOS.join(', ')}`),
];

module.exports = { idRule, createOrderRules, updateStatusRules };
