const { Router } = require('express');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const menuItemRoutes = require('./menuItemRoutes');
const orderRoutes = require('./orderRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/menu-items', menuItemRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
