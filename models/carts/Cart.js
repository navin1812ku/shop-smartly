const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const Cart = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [CartItemSchema]
});

module.exports = mongoose.model('Cart', Cart);