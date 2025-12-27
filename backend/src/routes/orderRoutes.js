const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Create order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Order items are required' 
    });
  }

  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  res.status(201).json({ success: true, order });
}));

// Get user's orders
router.get('/my', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'title images')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, orders });
}));

// Get order by id (owner or admin)
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'title images');
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }

  if (req.user._id.toString() !== order.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized to view this order' 
    });
  }

  res.json({ success: true, order });
}));

// Mark as paid
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized' 
    });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  
  const updated = await order.save();
  
  res.json({ success: true, order: updated });
}));

// Admin: list all orders
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('orderItems.product', 'title images')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, orders });
}));

// Update order to delivered (admin only)
router.put('/:id/deliver', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  
  const updated = await order.save();
  
  res.json({ success: true, order: updated });
}));

module.exports = router;
