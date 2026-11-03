const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define(
  'Order',
  {
    tableNumber: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM('pendiente', 'en_preparacion', 'servido', 'pagado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    notes: { type: DataTypes.STRING(255) },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  },
  { tableName: 'orders' }
);

module.exports = Order;
