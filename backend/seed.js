require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_EMAIL = 'admin@ankaprime.az';
const ADMIN_PASSWORD = 'Admin123!';

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('👤 Admin already exists, skipping...');
        } else {
            const admin = new User({
                fullName: 'Admin',
                email: ADMIN_EMAIL,
                passwordHash: ADMIN_PASSWORD,
                role: 'admin'
            });
            await admin.save();
            console.log(`👤 Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
        }

        console.log('\n✨ Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
}

seed();
