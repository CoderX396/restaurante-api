require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Category, MenuItem } = require('./models');

const sembrar = async () => {
  await sequelize.authenticate();
  // force: true borra y recrea las tablas. Solo para preparar datos de prueba.
  await sequelize.sync({ force: true });

  const password = await bcrypt.hash('Admin123!', 10);
  const passwordMesero = await bcrypt.hash('Mesero123!', 10);

  await User.bulkCreate([
    { name: 'Administrador', email: 'admin@restaurante.com', password, role: 'admin' },
    { name: 'Mesero de prueba', email: 'mesero@restaurante.com', password: passwordMesero, role: 'mesero' },
  ]);

  const [entradas, platos, bebidas] = await Category.bulkCreate(
    [
      { name: 'Entradas', description: 'Para compartir' },
      { name: 'Platos fuertes', description: 'Comida criolla' },
      { name: 'Bebidas', description: 'Jugos y refrescos' },
    ],
    { returning: true }
  );

  await MenuItem.bulkCreate([
    { name: 'Tostones con salami', price: 250, categoryId: entradas.id },
    { name: 'Quipes (4 unidades)', price: 180, categoryId: entradas.id },
    { name: 'La bandera dominicana', description: 'Arroz, habichuelas y carne guisada', price: 450, categoryId: platos.id },
    { name: 'Mofongo de chicharrón', price: 520, categoryId: platos.id },
    { name: 'Sancocho', price: 480, categoryId: platos.id, available: false },
    { name: 'Jugo de chinola', price: 120, categoryId: bebidas.id },
    { name: 'Morir soñando', price: 150, categoryId: bebidas.id },
  ]);

  console.log('Datos de prueba creados.');
  console.log('Admin:  admin@restaurante.com / Admin123!');
  console.log('Mesero: mesero@restaurante.com / Mesero123!');
  await sequelize.close();
};

sembrar().catch((error) => {
  console.error('Error al sembrar datos:', error.message);
  process.exit(1);
});
