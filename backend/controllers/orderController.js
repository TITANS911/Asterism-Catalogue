const { Order, OrderItem, Product, User, OrderStatusHistory } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ASTR-${year}${month}-${random}`;
};

const getEffectiveProductPrice = (product) => {
  const regularPrice = Number(product.price) || 0;
  const discountPrice = Number(product.discount_price);

  if (!Number.isNaN(discountPrice) && discountPrice > 0 && discountPrice < regularPrice) {
    return discountPrice;
  }

  return regularPrice;
};

const recordOrderHistory = async ({
  order_id,
  event_type,
  field_name = null,
  from_value = null,
  to_value = null,
  source = 'system',
  created_by_user_id = null,
  transaction = null
}) => {
  return OrderStatusHistory.create({
    order_id,
    event_type,
    field_name,
    from_value: from_value === undefined ? null : from_value,
    to_value: to_value === undefined ? null : to_value,
    source,
    created_by_user_id,
    created_at: new Date()
  }, transaction ? { transaction } : undefined);
};

const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      payment_status,
      exclude_payment_status,
      payment_method,
      search,
      start_date,
      end_date
    } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (status) {
      where.order_status = status;
    }
    
    if (payment_status) {
      where.payment_status = payment_status;
    } else if (exclude_payment_status) {
      where.payment_status = { [Op.ne]: exclude_payment_status };
    }

    if (payment_method) {
      where.payment_method = payment_method;
    }

    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) {
        where.created_at[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        where.created_at[Op.lte] = new Date(end_date);
      }
    }
    
    if (search) {
      where[Op.or] = [
        { order_number: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: OrderItem, as: 'items' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        orders: rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total_items: count,
          total_pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const pendingPayment = await Order.count({ where: { payment_status: 'pending' } });
    const paidPayment = await Order.count({ where: { payment_status: 'paid' } });
    const failedPayment = await Order.count({ where: { payment_status: 'failed' } });
    const processingOrders = await Order.count({ where: { order_status: 'processing' } });
    const shippedOrders = await Order.count({ where: { order_status: 'shipped' } });
    const completedOrders = await Order.count({ where: { order_status: 'completed' } });

    const paymentMethodRows = await Order.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('payment_method')), 'payment_method']],
      where: {
        payment_method: { [Op.ne]: null }
      },
      raw: true
    });

    const paymentMethods = paymentMethodRows
      .map((row) => row.payment_method)
      .filter((value) => typeof value === 'string' && value.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      data: {
        total_orders: totalOrders,
        pending_payment: pendingPayment,
        approved_payment: paidPayment,
        rejected_payment: failedPayment,
        processing: processingOrders,
        shipped: shippedOrders,
        completed: completedOrders,
        payment_methods: paymentMethods
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: OrderItem, as: 'items', include: ['product'] },
        { model: OrderStatusHistory, as: 'status_histories' }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const payload = order.toJSON ? order.toJSON() : order;
    if (Array.isArray(payload.status_histories)) {
      payload.status_histories.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    res.json({
      success: true,
      data: payload
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_zip,
      items,
      shipping_cost = 0,
      payment_method,
      notes
    } = req.body;

    const createdOrder = await sequelize.transaction(async (transaction) => {
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction });

        if (!product) {
          const error = new Error(`Product with id ${item.product_id} not found`);
          error.statusCode = 404;
          throw error;
        }

        const unitPrice = getEffectiveProductPrice(product);
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_id: item.product_id,
          product_name: product.name,
          variant_id: item.variant_id || null,
          variant_name: item.variant_name || null,
          quantity: item.quantity,
          price: unitPrice,
          subtotal: itemTotal
        });
      }

      const discount = 0;
      const tax = 0;
      const parsedShippingCost = Number(shipping_cost) || 0;
      const total = subtotal + parsedShippingCost + tax - discount;

      const order = await Order.create({
        order_number: generateOrderNumber(),
        user_id: req.user?.id || null,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_zip,
        subtotal,
        shipping_cost: parsedShippingCost,
        discount,
        tax,
        total,
        payment_method,
        notes,
        payment_status: 'pending',
        order_status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });

      await recordOrderHistory({
        order_id: order.id,
        event_type: 'order_created',
        field_name: 'order_status',
        from_value: null,
        to_value: 'pending',
        source: 'system',
        created_by_user_id: req.user?.id || null,
        transaction
      });

      await recordOrderHistory({
        order_id: order.id,
        event_type: 'order_created',
        field_name: 'payment_status',
        from_value: null,
        to_value: 'pending',
        source: 'system',
        created_by_user_id: req.user?.id || null,
        transaction
      });

      for (const item of orderItems) {
        await OrderItem.create({
          order_id: order.id,
          ...item
        }, { transaction });
      }

      const fetchedOrder = await Order.findByPk(order.id, {
        include: [
          { model: OrderItem, as: 'items' },
          { model: OrderStatusHistory, as: 'status_histories' }
        ],
        transaction
      });

      const payload = fetchedOrder.toJSON ? fetchedOrder.toJSON() : fetchedOrder;
      if (Array.isArray(payload.status_histories)) {
        payload.status_histories.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }

      return payload;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const { order_status, payment_status } = req.body;

    const previousOrderStatus = order.order_status;
    const previousPaymentStatus = order.payment_status;
    const nextOrderStatus = order_status || previousOrderStatus;
    const nextPaymentStatus = payment_status || previousPaymentStatus;

    const updatedOrder = await sequelize.transaction(async (transaction) => {
      await order.update({
        order_status: nextOrderStatus,
        payment_status: nextPaymentStatus,
        updated_at: new Date()
      }, { transaction });

      if (previousOrderStatus !== nextOrderStatus) {
        await recordOrderHistory({
          order_id: order.id,
          event_type: 'order_status_changed',
          field_name: 'order_status',
          from_value: previousOrderStatus,
          to_value: nextOrderStatus,
          source: 'admin',
          created_by_user_id: req.user?.id || null,
          transaction
        });
      }

      if (previousPaymentStatus !== nextPaymentStatus) {
        await recordOrderHistory({
          order_id: order.id,
          event_type: 'payment_status_changed',
          field_name: 'payment_status',
          from_value: previousPaymentStatus,
          to_value: nextPaymentStatus,
          source: 'admin',
          created_by_user_id: req.user?.id || null,
          transaction
        });
      }

      const fetchedOrder = await Order.findByPk(order.id, {
        include: [
          { model: User, as: 'user' },
          { model: OrderItem, as: 'items' },
          { model: OrderStatusHistory, as: 'status_histories' }
        ],
        transaction
      });

      const payload = fetchedOrder.toJSON ? fetchedOrder.toJSON() : fetchedOrder;
      if (Array.isArray(payload.status_histories)) {
        payload.status_histories.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }

      return payload;
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: ['items'] });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_zip,
      items,
      payment_method,
      notes,
      order_status,
      payment_status
    } = req.body;

    const previousOrderStatus = order.order_status;
    const previousPaymentStatus = order.payment_status;
    const previousPaymentMethod = order.payment_method;

    let updateData = {};
    if (customer_name !== undefined) updateData.customer_name = customer_name;
    if (customer_email !== undefined) updateData.customer_email = customer_email;
    if (customer_phone !== undefined) updateData.customer_phone = customer_phone;
    if (shipping_address !== undefined) updateData.shipping_address = shipping_address;
    if (shipping_city !== undefined) updateData.shipping_city = shipping_city;
    if (shipping_zip !== undefined) updateData.shipping_zip = shipping_zip;
    if (payment_method !== undefined) updateData.payment_method = payment_method;
    if (notes !== undefined) updateData.notes = notes;
    if (order_status !== undefined) updateData.order_status = order_status;
    if (payment_status !== undefined) updateData.payment_status = payment_status;

    updateData.updated_at = new Date();

    const updatedOrder = await sequelize.transaction(async (transaction) => {
      if (items && items.length > 0) {
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
          const product = await Product.findByPk(item.product_id, { transaction });

          if (!product) {
            const error = new Error(`Product with id ${item.product_id} not found`);
            error.statusCode = 404;
            throw error;
          }

          const unitPrice = getEffectiveProductPrice(product);
          const itemTotal = unitPrice * item.quantity;
          subtotal += itemTotal;

          orderItems.push({
            product_id: item.product_id,
            product_name: product.name,
            variant_id: item.variant_id || null,
            variant_name: item.variant_name || null,
            quantity: item.quantity,
            price: unitPrice,
            subtotal: itemTotal
          });
        }

        const shipping_cost = order.shipping_cost || 0;
        const discount = order.discount || 0;
        const tax = order.tax || 0;
        updateData.subtotal = subtotal;
        updateData.total = subtotal + shipping_cost + tax - discount;

        await OrderItem.destroy({ where: { order_id: order.id }, transaction });

        for (const item of orderItems) {
          await OrderItem.create({
            order_id: order.id,
            ...item
          }, { transaction });
        }
      }

      await order.update(updateData, { transaction });

      const nextOrderStatus = updateData.order_status ?? previousOrderStatus;
      const nextPaymentStatus = updateData.payment_status ?? previousPaymentStatus;
      const nextPaymentMethod = updateData.payment_method ?? previousPaymentMethod;

      if (previousOrderStatus !== nextOrderStatus) {
        await recordOrderHistory({
          order_id: order.id,
          event_type: 'order_status_changed',
          field_name: 'order_status',
          from_value: previousOrderStatus,
          to_value: nextOrderStatus,
          source: 'admin',
          created_by_user_id: req.user?.id || null,
          transaction
        });
      }

      if (previousPaymentStatus !== nextPaymentStatus) {
        await recordOrderHistory({
          order_id: order.id,
          event_type: 'payment_status_changed',
          field_name: 'payment_status',
          from_value: previousPaymentStatus,
          to_value: nextPaymentStatus,
          source: 'admin',
          created_by_user_id: req.user?.id || null,
          transaction
        });
      }

      if (previousPaymentMethod !== nextPaymentMethod) {
        await recordOrderHistory({
          order_id: order.id,
          event_type: 'payment_method_changed',
          field_name: 'payment_method',
          from_value: previousPaymentMethod,
          to_value: nextPaymentMethod,
          source: 'admin',
          created_by_user_id: req.user?.id || null,
          transaction
        });
      }

      const fetchedOrder = await Order.findByPk(order.id, {
        include: [
          { model: User, as: 'user' },
          { model: OrderItem, as: 'items' },
          { model: OrderStatusHistory, as: 'status_histories' }
        ],
        transaction
      });

      const payload = fetchedOrder.toJSON ? fetchedOrder.toJSON() : fetchedOrder;
      if (Array.isArray(payload.status_histories)) {
        payload.status_histories.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }

      return payload;
    });

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Delete order items first
    await OrderItem.destroy({ where: { order_id: order.id } });
    await OrderStatusHistory.destroy({ where: { order_id: order.id } });
    
    // Delete the order
    await order.destroy();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    
    const totalRevenue = await Order.sum('total', {
      where: { order_status: 'completed' }
    });

    const pendingOrders = await Order.count({
      where: { order_status: 'pending' }
    });

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: ['items']
    });

    res.json({
      success: true,
      data: {
        total_orders: totalOrders,
        total_products: totalProducts,
        total_users: totalUsers,
        total_revenue: totalRevenue || 0,
        pending_orders: pendingOrders,
        recent_orders: recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderStats,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats
};
