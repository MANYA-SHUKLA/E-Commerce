const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserOrders, createOrder, getOrderDetails, processPayment } = require('../controllers/orderController');

router.get('/', authMiddleware.protect, getUserOrders);
router.post('/', authMiddleware.protect, createOrder);
router.get('/:orderId', authMiddleware.protect, getOrderDetails);
router.post('/:orderId/payment', authMiddleware.protect, processPayment);

module.exports = router;