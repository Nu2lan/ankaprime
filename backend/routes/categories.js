const router = require('express').Router();
const Category = require('../models/Category');

// GET /api/categories
router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true })
            .sort({ name: 1 })
            .lean();
        res.json({ categories });
    } catch (error) {
        next(error);
    }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug, isActive: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ category });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
