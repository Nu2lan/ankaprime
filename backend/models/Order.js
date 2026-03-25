const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    titleSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    imageSnapshot: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    deliveryMethod: { type: String, default: 'standard' },
    deliveryFee: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: null },
    status: {
        type: String,
        enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
    payment: {
        provider: { type: String, default: '' },
        status: { type: String, default: 'pending' },
        transactionId: { type: String, default: '' },
        rawPayload: { type: mongoose.Schema.Types.Mixed, default: null }
    },
    createdAt: { type: Date, default: Date.now }
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
