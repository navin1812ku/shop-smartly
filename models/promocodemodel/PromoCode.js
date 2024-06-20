const mongoose = require('mongoose');

const PromoCode = new mongoose.Schema({
    promoCode: { type: String, required: true },
    discount: { type: String, required: true }
});

module.exports = mongoose.model('promocode', PromoCode);