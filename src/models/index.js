const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Una categoría tiene muchos platos; cada plato pertenece a una categoría.
Category.hasMany(MenuItem, { foreignKey: 'categoryId', as: 'items' });
MenuItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Un mesero (User) crea muchos pedidos.
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'waiter' });

// Un pedido tiene muchos platos y un plato aparece en muchos pedidos.
Order.belongsToMany(MenuItem, { through: OrderItem, foreignKey: 'orderId', as: 'items' });
MenuItem.belongsToMany(Order, { through: OrderItem, foreignKey: 'menuItemId', as: 'orders' });

module.exports = { sequelize, User, Category, MenuItem, Order, OrderItem };
