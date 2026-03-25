const router = require('express').Router();
const Order = require('../models/Order');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// POST /api/payments/create — placeholder payment initiation
router.post('/create', async (req, res, next) => {
    try {
        const { orderId, provider = 'card' } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Simulate payment processing
        const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        order.payment = {
            provider,
            status: 'completed',
            transactionId,
            rawPayload: { simulated: true, timestamp: new Date() }
        };
        order.status = 'paid';
        await order.save();

        res.json({
            message: 'Payment successful',
            transactionId,
            order
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/payments/webhook — placeholder webhook
router.post('/webhook', async (req, res) => {
    console.log('[Payment Webhook]', req.body);
    res.json({ received: true });
});

// GET /api/payments/status/:orderId
router.get('/status/:orderId', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId).select('payment status');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ payment: order.payment, orderStatus: order.status });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
