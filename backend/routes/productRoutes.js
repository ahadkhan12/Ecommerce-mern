import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = new Product({
      name: name || 'New Keyboard Pro',
      price: price || 99.99,
      image: image || '/images/keyboard.jpg',
      brand: brand || 'AuraTech',
      category: category || 'Keyboards',
      countInStock: countInStock || 10,
      description: description || 'Provide product description here...',
      rating: 5,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.price = price ?? product.price;
      product.description = description ?? product.description;
      product.image = image ?? product.image;
      product.brand = brand ?? product.brand;
      product.category = category ?? product.category;
      product.countInStock = countInStock ?? product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// Let's write the real GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { keyword, category, sortBy } = req.query;

    const query = {};

    // Search filter: search by keyword in name or description
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all' && category.trim() !== '') {
      query.category = category;
    }

    // Determine sorting
    let sortOrder = {};
    if (sortBy === 'price-low') {
      sortOrder = { price: 1 };
    } else if (sortBy === 'price-high') {
      sortOrder = { price: -1 };
    } else if (sortBy === 'rating') {
      sortOrder = { rating: -1 };
    } else {
      sortOrder = { createdAt: -1 }; // default: newest first
    }

    const products = await Product.find(query).sort(sortOrder);

    // Get unique categories for side filter panel
    const categories = await Product.distinct('category');

    res.json({ products, categories });
  } catch (error) {
    next(error);
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    // Cast error handling (invalid ObjectIds)
    if (error.kind === 'ObjectId') {
      res.status(404);
      return res.json({ message: 'Product not found (Invalid ID)' });
    }
    next(error);
  }
});

export default router;
