require('dotenv').config();
const { Sequelize } = require('sequelize');

const opciones = {
  dialect: 'postgres',
  logging: false,
};

let sequelize;

if (process.env.DATABASE_URL) {
  const usaSSL = process.env.DATABASE_URL.includes('sslmode=require');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    ...opciones,
    dialectOptions: usaSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'restaurante',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      ...opciones,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
    }
  );
}

module.exports = sequelize;
