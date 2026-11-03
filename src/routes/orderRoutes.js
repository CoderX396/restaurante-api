const { Router } = require('express');
const orders = require('../controllers/orderController');
const { idRule, createOrderRules, updateStatusRules } = require('../validators/orderValidators');
const validate = require('../middlewares/validate');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(verifyToken, checkRole('admin', 'mesero'));

router.get('/', asyncHandler(orders.list));
router.get('/:id', idRule, validate, asyncHandler(orders.getById));
router.post('/', createOrderRules, validate, asyncHandler(orders.create));
router.patch('/:id/status', updateStatusRules, validate, asyncHandler(orders.updateStatus));
router.delete('/:id', checkRole('admin'), idRule, validate, asyncHandler(orders.remove));

module.exports = router;
