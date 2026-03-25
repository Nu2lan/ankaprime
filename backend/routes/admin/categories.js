const router = require('express').Router();
const Category = require('../../models/Category');
const { z } = require('zod');
const validate = require('../../middleware/validate');
const slugify = require('slugify');

const localizedStringSchema = z.object({
    az: z.string().optional().default(''),
    en: z.string().optional().default(''),
    ru: z.string().optional().default('')
});

const categorySchema = z.object({
    name: localizedStringSchema,
    description: localizedStringSchema.optional(),
    isActive: z.boolean().optional()
});

// GET /api/admin/categories
router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ 'name.en': 1 }).lean();
        res.json({ categories });
    } catch (error) {
        next(error);
    }
});

// POST /api/admin/categories
router.post('/', validate(categorySchema), async (req, res, next) => {
    try {
        const { name, description, isActive } = req.body;
        const nameForSlug = name?.en || name?.az || name?.ru || '';
        const slug = slugify(nameForSlug, { lower: true, strict: true });

        const existing = await Category.findOne({ slug });
        if (existing) {
            return res.status(409).json({ message: 'Category with this name already exists' });
        }

        const category = new Category({ name, slug, description, isActive });
        await category.save();
        res.status(201).json({ category });
    } catch (error) {
        next(error);
    }
});

// PUT /api/admin/categories/:id
router.put('/:id', async (req, res, next) => {
    try {
        const updates = req.body;
        if (updates.name) {
            const nameForSlug = updates.name?.en || updates.name?.az || updates.name?.ru || '';
            updates.slug = slugify(nameForSlug, { lower: true, strict: true });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ category });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/categories/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
