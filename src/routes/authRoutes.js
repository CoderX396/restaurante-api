const { Router } = require('express');
const auth = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidators');
const validate = require('../middlewares/validate');
const verifyToken = require('../middlewares/verifyToken');
const { authLimiter } = require('../middlewares/rateLimiters');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.post('/register', authLimiter, registerRules, validate, asyncHandler(auth.register));
router.post('/login', authLimiter, loginRules, validate, asyncHandler(auth.login));
router.get('/me', verifyToken, asyncHandler(auth.me));

module.exports = router;
