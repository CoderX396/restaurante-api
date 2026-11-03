const { Router } = require('express');
const categories = require('../controllers/categoryController');
const { idRule, createCategoryRules, updateCategoryRules } = require('../validators/categoryValidators');
const validate = require('../middlewares/validate');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(verifyToken);

router.get('/', asyncHandler(categories.list));
router.get('/:id', idRule, validate, asyncHandler(categories.getById));
router.post('/', checkRole('admin'), createCategoryRules, validate, asyncHandler(categories.create));
router.put('/:id', checkRole('admin'), updateCategoryRules, validate, asyncHandler(categories.update));
router.delete('/:id', checkRole('admin'), idRule, validate, asyncHandler(categories.remove));

module.exports = router;
