const router = require('express').Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/products — public catalog with search, filters, sort, pagination
router.get('/', async (req, res, next) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 12
        } = req.query;

        const filter = { isActive: true };

        if (search) {
            filter.$text = { $search: search };
        }

        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) filter.categoryId = cat._id;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sortObj = {};
        if (search && sort === 'relevance') {
            sortObj.score = { $meta: 'textScore' };
        } else {
            sortObj[sort] = order === 'asc' ? 1 : -1;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('categoryId', 'name slug')
                .sort(sortObj)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Product.countDocuments(filter)
        ]);

        res.json({
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/products/featured
router.get('/featured', async (req, res, next) => {
    try {
        const products = await Product.find({ isFeatured: true, isActive: true })
            .populate('categoryId', 'name slug')
            .limit(8)
            .lean();
        res.json({ products });
    } catch (error) {
        next(error);
    }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, isActive: true })
            .populate('categoryId', 'name slug');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
