const { Router } = require('express');
const menu = require('../controllers/menuItemController');
const {
  idRule,
  listMenuItemRules,
  createMenuItemRules,
  updateMenuItemRules,
} = require('../validators/menuItemValidators');
const validate = require('../middlewares/validate');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(verifyToken);

router.get('/', listMenuItemRules, validate, asyncHandler(menu.list));
router.get('/:id', idRule, validate, asyncHandler(menu.getById));
router.post('/', checkRole('admin'), createMenuItemRules, validate, asyncHandler(menu.create));
router.put('/:id', checkRole('admin'), updateMenuItemRules, validate, asyncHandler(menu.update));
// Acción restringida: solo el administrador puede eliminar platos.
router.delete('/:id', checkRole('admin'), idRule, validate, asyncHandler(menu.remove));

module.exports = router;
