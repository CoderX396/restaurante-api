const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabla intermedia entre Order y MenuItem: guarda cantidad y precio del momento.
const OrderItem = sequelize.define(
  'OrderItem',
  {
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: 'order_items' }
);

module.exports = OrderItem;
