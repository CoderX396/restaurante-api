const { Category, MenuItem } = require('../models');
const AppError = require('../utils/AppError');

const buscarOFallar = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new AppError('Categoría no encontrada', 404);
  return category;
};

const list = async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  res.json({ status: 'success', results: categories.length, data: categories });
};

const getById = async (req, res) => {
  const category = await Category.findByPk(req.params.id, {
    include: [{ model: MenuItem, as: 'items' }],
  });
  if (!category) throw new AppError('Categoría no encontrada', 404);
  res.json({ status: 'success', data: category });
};

const create = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({ status: 'success', data: category });
};

const update = async (req, res) => {
  const category = await buscarOFallar(req.params.id);
  const { name, description } = req.body;
  await category.update({ name, description });
  res.json({ status: 'success', data: category });
};

const remove = async (req, res) => {
  const category = await buscarOFallar(req.params.id);
  const cantidad = await MenuItem.count({ where: { categoryId: category.id } });
  if (cantidad > 0) {
    throw new AppError('No se puede eliminar una categoría que todavía tiene platos', 409);
  }
  await category.destroy();
  res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
