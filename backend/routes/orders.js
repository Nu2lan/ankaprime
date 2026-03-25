const router = require('express').Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// POST /api/orders — create order from cart
router.post('/', async (req, res, next) => {
    try {
        const { shippingAddress, deliveryMethod = 'standard', couponCode } = req.body;

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        const cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Build order items and validate stock
        const orderItems = [];
        for (const item of cart.items) {
            const product = item.productId;
            if (!product || !product.isActive) {
                return res.status(400).json({ message: `Product ${item.productId} is no longer available` });
            }
            if (product.stock < item.qty) {
                const t = typeof product.title === 'object' ? (product.title.en || product.title.az || product.title.ru) : product.title;
                return res.status(400).json({ message: `Insufficient stock for ${t}` });
            }
            orderItems.push({
                productId: product._id,
                titleSnapshot: typeof product.title === 'object' ? (product.title.en || product.title.az || product.title.ru || '') : (product.title || ''),
                priceSnapshot: product.price,
                qty: item.qty,
                imageSnapshot: product.images[0] || ''
            });
        }

        const subtotal = orderItems.reduce((sum, item) => sum + item.priceSnapshot * item.qty, 0);
        const deliveryFee = deliveryMethod === 'express' ? 29.99 : (subtotal >= 500 ? 0 : 14.99);

        let discount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true,
                expiryDate: { $gt: new Date() }
            });
            if (coupon && subtotal >= coupon.minOrder) {
                discount = coupon.type === 'percent'
                    ? Math.round(subtotal * coupon.value / 100 * 100) / 100
                    : coupon.value;
                discount = Math.min(discount, subtotal);
                await Coupon.updateOne({ _id: coupon._id }, { $inc: { usageCount: 1 } });
            }
        }

        const total = Math.round((subtotal - discount + deliveryFee) * 100) / 100;

        const order = new Order({
            userId: req.user._id,
            items: orderItems,
            shippingAddress,
            deliveryMethod,
            deliveryFee,
            subtotal,
            discount,
            total,
            couponCode: couponCode || null,
            status: 'pending'
        });

        await order.save();

        // Decrement stock
        for (const item of orderItems) {
            await Product.updateOne(
                { _id: item.productId },
                { $inc: { stock: -item.qty } }
            );
        }

        // Clear cart
        await Cart.findOneAndDelete({ userId: req.user._id });

        res.status(201).json({ order });
    } catch (error) {
        next(error);
    }
});

// GET /api/orders/my — user's orders
router.get('/my', async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        res.json({ orders });
    } catch (error) {
        next(error);
    }
});

// GET /api/orders/:id — order detail
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).lean();
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json({ order });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
