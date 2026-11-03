const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Conectado a PostgreSQL');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

iniciar();
