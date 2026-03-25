const router = require('express').Router();
const Product = require('../../models/Product');
const { z } = require('zod');
const validate = require('../../middleware/validate');
const slugify = require('slugify');

const localizedStringSchema = z.object({
    az: z.string().optional().default(''),
    en: z.string().optional().default(''),
    ru: z.string().optional().default('')
});

const productSchema = z.object({
    title: localizedStringSchema,
    price: z.number().positive(),
    oldPrice: z.number().positive().optional().nullable(),
    currency: z.string().optional(),
    images: z.array(z.string()).optional(),
    description: localizedStringSchema.optional(),
    categoryId: z.string().min(1),
    stock: z.number().int().min(0).optional(),
    attributes: z.object({
        material: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
        brand: z.string().optional()
    }).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional()
});

// POST /api/admin/products
router.post('/', validate(productSchema), async (req, res, next) => {
    try {
        const data = req.body;
        const titleForSlug = data.title?.en || data.title?.az || data.title?.ru || '';
        data.slug = slugify(titleForSlug, { lower: true, strict: true });

        const existing = await Product.findOne({ slug: data.slug });
        if (existing) {
            data.slug = data.slug + '-' + Date.now();
        }

        const product = new Product(data);
        await product.save();

        const populated = await Product.findById(product._id).populate('categoryId', 'name slug');
        res.status(201).json({ product: populated });
    } catch (error) {
        next(error);
    }
});

// PUT /api/admin/products/:id
router.put('/:id', async (req, res, next) => {
    try {
        const updates = req.body;
        if (updates.title) {
            const titleForSlug = updates.title?.en || updates.title?.az || updates.title?.ru || '';
            updates.slug = slugify(titleForSlug, { lower: true, strict: true });
            const existing = await Product.findOne({ slug: updates.slug, _id: { $ne: req.params.id } });
            if (existing) {
                updates.slug = updates.slug + '-' + Date.now();
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate('categoryId', 'name slug');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/products/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/products — with all products including inactive
router.get('/', async (req, res, next) => {
    try {
        const { search, category, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { 'title.en': { $regex: search, $options: 'i' } },
                { 'title.az': { $regex: search, $options: 'i' } },
                { 'title.ru': { $regex: search, $options: 'i' } },
                { 'description.en': { $regex: search, $options: 'i' } }
            ];
        }
        if (category) {
            filter.categoryId = category;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('categoryId', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Product.countDocuments(filter)
        ]);

        res.json({
            products,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
