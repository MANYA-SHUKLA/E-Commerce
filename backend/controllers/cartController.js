const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/addToCart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      user.cart[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add new item to cart
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    
    res.json(updatedUser.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   POST /api/cart/removeFromCart
const removeFromCart = async (req, res) => {
  
  const { productId } = req.params;


  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the product to remove
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    
    res.json(updatedUser.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update quantity of an item in cart
// @route   PUT /api/cart/updateQuantity
const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: 'quantity must be a number >= 1' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    user.cart[itemIndex].quantity = qty;
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    return res.json(updatedUser.cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
};