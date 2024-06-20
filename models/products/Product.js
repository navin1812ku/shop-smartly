const mongoose = require('mongoose');
const { getCurrentDateTimeIST } = require('../../getdate/DateAndTime');

const Product = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    initialQuantity: { type: Number, required: true, default: 0 },
    stockQuantity: { type: Number, required: true, default: 0 },
    returnAvailable: { type: Boolean, required: true, default: true },
    replaceAvailable: { type: Boolean, required: true, default: true },
    ratings: { type: Number, default: 3 },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, required: true },
            review: { type: String, required: true }
        }
    ],
    createdAt: { type: String, default: getCurrentDateTimeIST() },
    updatedAt: { type: String, default: getCurrentDateTimeIST() }
});

module.exports = mongoose.model('Product', Product);