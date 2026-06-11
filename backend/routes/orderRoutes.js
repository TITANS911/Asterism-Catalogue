const express = require('express');
const {
  getAllOrders,
  getOrderStats,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats
} = require('../controllers/orderController');
const { auth, authAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authAdmin, getDashboardStats);
router.get('/stats', authAdmin, getOrderStats);
router.get('/', authAdmin, getAllOrders);
router.get('/my', auth, getMyOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);
router.put('/:id', authAdmin, updateOrder);
router.put('/:id/status', authAdmin, updateOrderStatus);
router.delete('/:id', authAdmin, deleteOrder);

module.exports = router;
