const router = require('express').Router();
const Product = require('../models/product');
const { protect, admin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { validateProduct } = require('../middleware/validator');

// Get all products with pagination and filtering
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;

  // Build query
  const query = {};
  if (category) query.category = category.toLowerCase();
  if (search) {
    query.$text = { $search: search };
  }

  const products = await Product.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit),
    total
  });
}));

// Get single product
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({ 
      success: false, 
      message: 'Product not found' 
    });
  }

  res.json({ success: true, product });
}));

// Create product (admin only)
router.post('/', protect, admin, validateProduct, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
}));

// Update product (admin only)
router.put('/:id', protect, admin, validateProduct, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ 
      success: false, 
      message: 'Product not found' 
    });
  }

  res.json({ success: true, product });
}));

// Delete product (admin only)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ 
      success: false, 
      message: 'Product not found' 
    });
  }

  res.json({ success: true, message: 'Product deleted successfully' });
}));

module.exports = router;
