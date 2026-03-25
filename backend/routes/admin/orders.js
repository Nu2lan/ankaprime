const router = require('express').Router();
const Order = require('../../models/Order');

// GET /api/admin/orders
router.get('/', async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20, startDate, endDate } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('userId', 'fullName email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Order.countDocuments(filter)
        ]);

        res.json({
            orders,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/orders/stats
router.get('/stats', async (req, res, next) => {
    try {
        const [
            totalOrders,
            revenueResult,
            statusCounts,
            recentOrders
        ] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([
                { $match: { status: { $nin: ['canceled'] } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Order.find()
                .populate('userId', 'fullName email')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean()
        ]);

        const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        res.json({
            totalOrders,
            revenue,
            statusCounts: statusCounts.reduce((acc, s) => {
                acc[s._id] = s.count;
                return acc;
            }, {}),
            recentOrders
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/admin/orders/:id/status
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'fullName email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/orders/:id
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'fullName email phone');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ order });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
