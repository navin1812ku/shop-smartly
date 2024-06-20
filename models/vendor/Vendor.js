const mongoose = require('mongoose');
const { getCurrentDateTimeIST } = require('../../getdate/DateAndTime');

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
});

const Vendor = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    vendorId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: Address,
        required: true
    },
    brandOfVendor: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    addBy: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        createdAt: {
            type: String,
            default: getCurrentDateTimeIST()
        }
    }]
});

module.exports = mongoose.model('Vendor', Vendor);