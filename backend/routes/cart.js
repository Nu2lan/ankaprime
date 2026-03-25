const router = require('express').Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/cart
router.get('/', async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId', 'title slug price images stock');

        if (!cart) {
            cart = { items: [] };
        }

        res.json({ cart });
    } catch (error) {
        next(error);
    }
});

// POST /api/cart/items — add item to cart
router.post('/items', async (req, res, next) => {
    try {
        const { productId, qty = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < qty) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = new Cart({
                userId: req.user._id,
                items: [{ productId, qty, priceSnapshot: product.price }]
            });
        } else {
            const existingItem = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.qty += qty;
                existingItem.priceSnapshot = product.price;
            } else {
                cart.items.push({ productId, qty, priceSnapshot: product.price });
            }
        }

        await cart.save();

        cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId', 'title slug price images stock');

        res.json({ cart });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/cart/items/:productId — update quantity
router.patch('/items/:productId', async (req, res, next) => {
    try {
        const { qty } = req.body;
        const { productId } = req.params;

        if (qty < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const product = await Product.findById(productId);
        if (product && product.stock < qty) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not in cart' });
        }

        item.qty = qty;
        if (product) item.priceSnapshot = product.price;
        await cart.save();

        const updated = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId', 'title slug price images stock');

        res.json({ cart: updated });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/cart/items/:productId — remove item
router.delete('/items/:productId', async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            i => i.productId.toString() !== req.params.productId
        );
        await cart.save();

        const updated = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId', 'title slug price images stock');

        res.json({ cart: updated });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/cart — clear cart
router.delete('/', async (req, res, next) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user._id });
        res.json({ message: 'Cart cleared', cart: { items: [] } });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
