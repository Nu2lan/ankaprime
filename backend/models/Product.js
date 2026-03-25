const mongoose = require('mongoose');
const slugify = require('slugify');

const localizedString = {
    az: { type: String, default: '' },
    en: { type: String, default: '' },
    ru: { type: String, default: '' }
};

const productSchema = new mongoose.Schema({
    title: localizedString,
    slug: { type: String, unique: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    currency: { type: String, default: 'USD' },
    images: [{ type: String }],
    description: localizedString,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, default: 0 },
    attributes: {
        material: { type: String, default: '' },
        color: { type: String, default: '' },
        size: { type: String, default: '' },
        brand: { type: String, default: '' }
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        const t = this.title.en || this.title.az || this.title.ru || '';
        this.slug = slugify(t, { lower: true, strict: true });
    }
    next();
});

productSchema.index({ 'title.en': 'text', 'title.az': 'text', 'title.ru': 'text', 'description.en': 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
