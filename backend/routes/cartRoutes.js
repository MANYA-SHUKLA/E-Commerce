const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getCart, addToCart, removeFromCart, updateQuantity } = require('../controllers/cartController');


router.get('/',authMiddleware.protect, getCart);
router.post('/addToCart',authMiddleware.protect, addToCart);
router.delete('/removeFromCart/:productId',authMiddleware.protect, removeFromCart);
router.put('/updateQuantity', authMiddleware.protect, updateQuantity);

module.exports = router;