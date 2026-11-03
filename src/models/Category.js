const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define(
  'Category',
  {
    name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255) },
  },
  { tableName: 'categories' }
);

module.exports = Category;
