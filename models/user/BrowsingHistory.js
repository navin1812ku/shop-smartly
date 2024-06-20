const mongoose = require('mongoose');
const { getCurrentDateTimeIST } = require('../../getdate/DateAndTime');

const BrowsingHistory = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewedProducts: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            viewedAt: { type: String, default: getCurrentDateTimeIST() }
        }
    ],
});

module.exports = mongoose.model('BrowsingHistory', BrowsingHistory);