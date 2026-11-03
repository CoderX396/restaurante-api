const { MenuItem, Category } = require('../models');
const AppError = require('../utils/AppError');

const incluirCategoria = [{ model: Category, as: 'category', attributes: ['id', 'name'] }];

const validarCategoria = async (categoryId) => {
  if (categoryId === undefined) return;
  const existe = await Category.findByPk(categoryId);
  if (!existe) throw new AppError('La categoría indicada no existe', 400);
};

const list = async (req, res) => {
  const where = {};
  if (req.query.categoryId) where.categoryId = req.query.categoryId;
  if (req.query.available !== undefined) where.available = req.query.available === 'true';

  const items = await MenuItem.findAll({ where, include: incluirCategoria, order: [['name', 'ASC']] });
  res.json({ status: 'success', results: items.length, data: items });
};

const getById = async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id, { include: incluirCategoria });
  if (!item) throw new AppError('Plato no encontrado', 404);
  res.json({ status: 'success', data: item });
};

const create = async (req, res) => {
  const { name, description, price, available, categoryId } = req.body;
  await validarCategoria(categoryId);

  const item = await MenuItem.create({ name, description, price, available, categoryId });
  const conCategoria = await MenuItem.findByPk(item.id, { include: incluirCategoria });
  res.status(201).json({ status: 'success', data: conCategoria });
};

const update = async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) throw new AppError('Plato no encontrado', 404);

  const { name, description, price, available, categoryId } = req.body;
  await validarCategoria(categoryId);

  await item.update({ name, description, price, available, categoryId });
  const actualizado = await MenuItem.findByPk(item.id, { include: incluirCategoria });
  res.json({ status: 'success', data: actualizado });
};

const remove = async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) throw new AppError('Plato no encontrado', 404);
  await item.destroy();
  res.status(204).send();
};

module.exports = { list, getById, create, update, remove };
