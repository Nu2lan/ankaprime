require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop all data
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            Cart.deleteMany({}),
            Order.deleteMany({}),
            Coupon.deleteMany({})
        ]);
        console.log('✅ All collections cleared');

        // Create admin user
        const admin = await User.create({
            fullName: 'Admin',
            email: 'admin@luxe.com',
            passwordHash: 'Admin123!',
            role: 'admin'
        });
        console.log(`✅ Admin user created: ${admin.email}`);

        console.log('\n🎉 Database reset complete! Fresh start ready.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Reset failed:', err.message);
        process.exit(1);
    }
};

reset();
