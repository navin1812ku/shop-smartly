const mongoose = require('mongoose');

const Address = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    pincode: { type: Number, required: true },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, required: true }
});

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String, required: true
    },
    lastName: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    phoneNumber: {
        type: Number, required: true
    },
    role: {
        type: String, required: true
    },
    address: {
        type: [Address]
    },
    browsingHistory: {
        type: mongoose.Schema.Types.ObjectId, ref: 'BrowsingHistory'
    },
    orderHistory: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderHistory' }]
    },
    wishList: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WishList' }]
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Cart'
    }
});

module.exports = mongoose.model('User', UserSchema);
