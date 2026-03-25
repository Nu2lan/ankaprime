require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const ADMIN_EMAIL = 'admin@luxe.com';
const ADMIN_PASSWORD = 'Admin123!';

const categories = [
    { name: { en: 'Living Room', az: '', ru: '' }, description: { en: 'Sofas, chairs, coffee tables, and living room essentials', az: '', ru: '' } },
    { name: { en: 'Bedroom', az: '', ru: '' }, description: { en: 'Beds, nightstands, dressers, and bedroom furniture', az: '', ru: '' } },
    { name: { en: 'Dining', az: '', ru: '' }, description: { en: 'Dining tables, chairs, and dining room accessories', az: '', ru: '' } },
    { name: { en: 'Office', az: '', ru: '' }, description: { en: 'Desks, office chairs, bookshelves, and workspace furniture', az: '', ru: '' } },
    { name: { en: 'Outdoor', az: '', ru: '' }, description: { en: 'Patio sets, garden chairs, and outdoor living pieces', az: '', ru: '' } },
    { name: { en: 'Lighting', az: '', ru: '' }, description: { en: 'Chandeliers, floor lamps, table lamps, and pendant lights', az: '', ru: '' } }
];

const getProducts = (categoryMap) => [
    {
        title: { en: 'Velvet Chesterfield Sofa', az: '', ru: '' },
        price: 2499.99,
        oldPrice: 2999.99,
        description: { en: 'Handcrafted Chesterfield sofa upholstered in premium midnight blue velvet. Deep button tufting, rolled arms, and solid oak legs finished in walnut. Seats 3 comfortably with plush foam cushioning.', az: '', ru: '' },
        categoryId: categoryMap['Living Room'],
        stock: 8,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
        attributes: { material: 'Velvet', color: 'Midnight Blue', size: '220cm x 90cm x 80cm', brand: 'LUXE Artisan' },
        isFeatured: true
    },
    {
        title: { en: 'Marble & Gold Coffee Table', az: '', ru: '' },
        price: 899.99,
        description: { en: 'Elegant coffee table featuring a genuine Italian Carrara marble top set on a geometric brushed gold steel frame. A stunning centerpiece for any luxury living room.', az: '', ru: '' },
        categoryId: categoryMap['Living Room'],
        stock: 15,
        images: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800'],
        attributes: { material: 'Marble & Steel', color: 'White / Gold', size: '120cm x 60cm x 45cm', brand: 'LUXE Artisan' },
        isFeatured: true
    },
    {
        title: { en: 'King Platform Bed Frame', az: '', ru: '' },
        price: 1899.99,
        oldPrice: 2299.99,
        description: { en: 'Minimalist king-size platform bed crafted from solid American walnut. Features an integrated upholstered headboard in premium bouclé fabric. No box spring needed.', az: '', ru: '' },
        categoryId: categoryMap['Bedroom'],
        stock: 5,
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
        attributes: { material: 'Walnut Wood & Bouclé', color: 'Natural Walnut', size: 'King (193cm x 203cm)', brand: 'LUXE Artisan' },
        isFeatured: true
    },
    {
        title: { en: 'Velvet Wingback Nightstand', az: '', ru: '' },
        price: 449.99,
        description: { en: 'Art deco-inspired nightstand wrapped in sage green velvet with brass drawer pulls and tapered legs. Two drawers provide ample bedside storage.', az: '', ru: '' },
        categoryId: categoryMap['Bedroom'],
        stock: 20,
        images: ['https://images.unsplash.com/photo-1551298370-9d3d5a1e9a20?w=800'],
        attributes: { material: 'Velvet & Brass', color: 'Sage Green', size: '50cm x 40cm x 60cm', brand: 'LUXE Home' },
        isFeatured: false
    },
    {
        title: { en: 'Solid Oak Dining Table', az: '', ru: '' },
        price: 2199.99,
        description: { en: 'Solid European oak dining table with a live edge finish. Seats 6-8 guests. Each piece is unique with natural grain patterns. Supported by blackened steel trestle legs.', az: '', ru: '' },
        categoryId: categoryMap['Dining'],
        stock: 4,
        images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'],
        attributes: { material: 'Solid Oak', color: 'Natural Oak', size: '200cm x 95cm x 76cm', brand: 'LUXE Artisan' },
        isFeatured: true
    },
    {
        title: { en: 'Leather Dining Chair Set', az: '', ru: '' },
        price: 1299.99,
        oldPrice: 1599.99,
        description: { en: 'Set of 4 dining chairs upholstered in full-grain Italian leather. Slim profile with chrome-plated steel legs. Ergonomic curvature for extended dining comfort.', az: '', ru: '' },
        categoryId: categoryMap['Dining'],
        stock: 10,
        images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800'],
        attributes: { material: 'Italian Leather', color: 'Cognac', size: '45cm x 55cm x 85cm', brand: 'LUXE Home' },
        isFeatured: true
    },
    {
        title: { en: 'Executive Standing Desk', az: '', ru: '' },
        price: 1599.99,
        description: { en: 'Electric height-adjustable standing desk with a solid walnut top and matte black steel frame. Features memory presets, cable management tray, and smooth dual-motor lift.', az: '', ru: '' },
        categoryId: categoryMap['Office'],
        stock: 12,
        images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'],
        attributes: { material: 'Walnut & Steel', color: 'Walnut / Black', size: '160cm x 80cm x 65-125cm', brand: 'LUXE Office' },
        isFeatured: true
    },
    {
        title: { en: 'Ergonomic Leather Office Chair', az: '', ru: '' },
        price: 999.99,
        oldPrice: 1199.99,
        description: { en: 'Premium ergonomic office chair with full-grain leather upholstery, adjustable lumbar support, 4D armrests, and polished aluminum base. Built for all-day comfort.', az: '', ru: '' },
        categoryId: categoryMap['Office'],
        stock: 18,
        images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'],
        attributes: { material: 'Full-grain Leather', color: 'Black', size: '65cm x 65cm x 110-120cm', brand: 'LUXE Office' },
        isFeatured: false
    },
    {
        title: { en: 'Teak Lounge Set', az: '', ru: '' },
        price: 3499.99,
        description: { en: 'Premium outdoor lounge set crafted from grade-A plantation teak. Includes a 3-seater sofa, 2 armchairs, and a coffee table. Comes with Sunbrella® weather-resistant cushions.', az: '', ru: '' },
        categoryId: categoryMap['Outdoor'],
        stock: 3,
        images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=800'],
        attributes: { material: 'Teak Wood', color: 'Natural Teak', size: 'Set of 4 pieces', brand: 'LUXE Outdoor' },
        isFeatured: true
    },
    {
        title: { en: 'Woven Rope Garden Chair', az: '', ru: '' },
        price: 599.99,
        description: { en: 'Sculptural outdoor accent chair with hand-woven weather-resistant rope on a powder-coated aluminum frame. Includes plush all-weather seat cushion.', az: '', ru: '' },
        categoryId: categoryMap['Outdoor'],
        stock: 25,
        images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800'],
        attributes: { material: 'Rope & Aluminum', color: 'Sand', size: '70cm x 75cm x 85cm', brand: 'LUXE Outdoor' },
        isFeatured: false
    },
    {
        title: { en: 'Crystal Chandelier', az: '', ru: '' },
        price: 1799.99,
        oldPrice: 2199.99,
        description: { en: 'Stunning cascading crystal chandelier with 12 LED lights. Hand-cut K9 crystals on a brushed gold frame. Creates a breathtaking light display in any dining room or foyer.', az: '', ru: '' },
        categoryId: categoryMap['Lighting'],
        stock: 6,
        images: ['https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800'],
        attributes: { material: 'K9 Crystal & Steel', color: 'Gold / Crystal', size: '60cm diameter x 70cm height', brand: 'LUXE Artisan' },
        isFeatured: true
    },
    {
        title: { en: 'Arc Floor Lamp', az: '', ru: '' },
        price: 349.99,
        description: { en: 'Mid-century modern arc floor lamp with a brushed brass arm and natural linen drum shade. Adjustable height with a weighted marble base for stability.', az: '', ru: '' },
        categoryId: categoryMap['Lighting'],
        stock: 30,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800'],
        attributes: { material: 'Brass & Marble', color: 'Gold / White', size: '30cm x 100cm x 190cm', brand: 'LUXE Home' },
        isFeatured: false
    }
];

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({})
        ]);
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = new User({
            fullName: 'Admin User',
            email: ADMIN_EMAIL,
            passwordHash: ADMIN_PASSWORD,
            role: 'admin'
        });
        await admin.save();
        console.log(`👤 Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

        // Create demo user
        const demoUser = new User({
            fullName: 'John Doe',
            email: 'user@luxe.com',
            passwordHash: 'User123!',
            role: 'user',
            addresses: [{
                label: 'Home',
                fullName: 'John Doe',
                phone: '+1 555-0100',
                street: '123 Luxury Lane',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'US',
                isDefault: true
            }]
        });
        await demoUser.save();
        console.log('👤 Demo user created: user@luxe.com / User123!');

        // Create categories
        const createdCategories = [];
        for (const cat of categories) {
            const category = new Category(cat);
            await category.save();
            createdCategories.push(category);
        }
        console.log(`📁 Created ${createdCategories.length} categories`);

        // Build category map
        const categoryMap = {};
        createdCategories.forEach(c => { categoryMap[c.name.en] = c._id; });

        // Create products
        const products = getProducts(categoryMap);
        for (const prod of products) {
            const product = new Product(prod);
            await product.save();
        }
        console.log(`📦 Created ${products.length} products`);

        console.log('\n✨ Seed complete! You can now start the server.');
        console.log(`   Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
        console.log(`   User login: user@luxe.com / User123!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
}

seed();
