require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const { requireAuth, requireAdmin } = require('./middleware/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(generalLimiter);

// Public routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

// Protected routes
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));

// Admin routes
app.use('/api/admin/products', requireAuth, requireAdmin, require('./routes/admin/products'));
app.use('/api/admin/categories', requireAuth, requireAdmin, require('./routes/admin/categories'));
app.use('/api/admin/orders', requireAuth, requireAdmin, require('./routes/admin/orders'));
app.use('/api/admin/users', requireAuth, requireAdmin, require('./routes/admin/users'));
app.use('/api/admin/coupons', requireAuth, requireAdmin, require('./routes/admin/coupons'));
app.use('/api/admin/upload', requireAuth, requireAdmin, require('./routes/admin/upload'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dashboard stats endpoint
app.get('/api/admin/dashboard', requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const Product = require('./models/Product');
        const Order = require('./models/Order');
        const User = require('./models/User');

        const [
            totalProducts,
            lowStockProducts,
            orderStats,
            userStats,
            monthlySales
        ] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: {
                            $sum: { $cond: [{ $ne: ['$status', 'canceled'] }, '$total', 0] }
                        }
                    }
                }
            ]),
            User.countDocuments(),
            Order.aggregate([
                { $match: { status: { $nin: ['canceled'] } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                        revenue: { $sum: '$total' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                { $limit: 12 }
            ])
        ]);

        res.json({
            totalProducts,
            lowStockProducts,
            totalOrders: orderStats[0]?.totalOrders || 0,
            totalRevenue: orderStats[0]?.totalRevenue || 0,
            totalUsers: userStats,
            monthlySales
        });
    } catch (error) {
        next(error);
    }
});

// Health check
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    res.status(dbState === 1 ? 200 : 503).json({
        status: dbState === 1 ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus[dbState] || 'unknown',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
