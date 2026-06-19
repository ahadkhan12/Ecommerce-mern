import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new order & decrement product stock
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Create the order in the database
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product,
        _id: undefined, // remove front-end id to avoid schema conflict
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    // Decrement inventory stock for each ordered item
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.qty);
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if logged-in user owns the order (or is admin)
      if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404);
      return res.json({ message: 'Order not found (Invalid ID)' });
    }
    next(error);
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
