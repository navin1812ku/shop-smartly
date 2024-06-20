const mongoose = require('mongoose');
const { getCurrentDateTimeIST } = require('../../getdate/DateAndTime');

const WishList = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            addedAt: { type: String, default: getCurrentDateTimeIST() }
        }
    ]
});

module.exports = mongoose.model('WishList', WishList);