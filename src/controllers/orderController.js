const { sequelize, Order, MenuItem, User } = require('../models');
const AppError = require('../utils/AppError');

const incluirDetalle = [
  {
    model: MenuItem,
    as: 'items',
    attributes: ['id', 'name'],
    through: { attributes: ['quantity', 'unitPrice'] },
  },
  { model: User, as: 'waiter', attributes: ['id', 'name'] },
];

// El admin ve todos los pedidos; el mesero solo los suyos.
const filtroPorRol = (user) => (user.role === 'admin' ? {} : { userId: user.id });

const list = async (req, res) => {
  const orders = await Order.findAll({
    where: filtroPorRol(req.user),
    include: incluirDetalle,
    order: [['createdAt', 'DESC']],
  });
  res.json({ status: 'success', results: orders.length, data: orders });
};

const getById = async (req, res) => {
  const order = await Order.findOne({
    where: { id: req.params.id, ...filtroPorRol(req.user) },
    include: incluirDetalle,
  });
  if (!order) throw new AppError('Pedido no encontrado', 404);
  res.json({ status: 'success', data: order });
};

const create = async (req, res) => {
  const { tableNumber, notes, items } = req.body;
  const ids = [...new Set(items.map((i) => Number(i.menuItemId)))];

  const platos = await MenuItem.findAll({ where: { id: ids } });
  if (platos.length !== ids.length) throw new AppError('Uno o más platos no existen', 400);

  const noDisponible = platos.find((p) => !p.available);
  if (noDisponible) throw new AppError(`El plato "${noDisponible.name}" no está disponible`, 400);

  const precios = new Map(platos.map((p) => [p.id, Number(p.price)]));
  const total = items.reduce((suma, i) => suma + precios.get(Number(i.menuItemId)) * i.quantity, 0);

  const order = await sequelize.transaction(async (t) => {
    const nuevo = await Order.create(
      { tableNumber, notes, total: total.toFixed(2), userId: req.user.id },
      { transaction: t }
    );
    for (const item of items) {
      const plato = platos.find((p) => p.id === Number(item.menuItemId));
      await nuevo.addItem(plato, {
        through: { quantity: item.quantity, unitPrice: plato.price },
        transaction: t,
      });
    }
    return nuevo;
  });

  const completo = await Order.findByPk(order.id, { include: incluirDetalle });
  res.status(201).json({ status: 'success', data: completo });
};

const updateStatus = async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.id, ...filtroPorRol(req.user) } });
  if (!order) throw new AppError('Pedido no encontrado', 404);
  await order.update({ status: req.body.status });
  res.json({ status: 'success', data: order });
};

const remove = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) throw new AppError('Pedido no encontrado', 404);
  await order.destroy();
  res.status(204).send();
};

module.exports = { list, getById, create, updateStatus, remove };
