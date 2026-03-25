const mongoose = require('mongoose');
const slugify = require('slugify');

const localizedString = {
    az: { type: String, default: '' },
    en: { type: String, default: '' },
    ru: { type: String, default: '' }
};

const categorySchema = new mongoose.Schema({
    name: localizedString,
    slug: { type: String, unique: true },
    description: localizedString,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        const n = this.name.en || this.name.az || this.name.ru || '';
        this.slug = slugify(n, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
