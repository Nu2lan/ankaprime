const router = require('express').Router();
const Coupon = require('../../models/Coupon');
const { z } = require('zod');
const validate = require('../../middleware/validate');

const couponSchema = z.object({
    code: z.string().min(3),
    type: z.enum(['percent', 'fixed']),
    value: z.number().positive(),
    minOrder: z.number().min(0).optional(),
    expiryDate: z.string().min(1),
    isActive: z.boolean().optional()
});

// GET /api/admin/coupons
router.get('/', async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
        res.json({ coupons });
    } catch (error) {
        next(error);
    }
});

// POST /api/admin/coupons
router.post('/', validate(couponSchema), async (req, res, next) => {
    try {
        const coupon = new Coupon({
            ...req.body,
            code: req.body.code.toUpperCase(),
            expiryDate: new Date(req.body.expiryDate)
        });
        await coupon.save();
        res.status(201).json({ coupon });
    } catch (error) {
        next(error);
    }
});

// PUT /api/admin/coupons/:id
router.put('/:id', async (req, res, next) => {
    try {
        const updates = { ...req.body };
        if (updates.code) updates.code = updates.code.toUpperCase();
        if (updates.expiryDate) updates.expiryDate = new Date(updates.expiryDate);

        const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json({ coupon });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/coupons/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
