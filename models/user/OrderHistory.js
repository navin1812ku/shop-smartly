const mongoose = require('mongoose');
const { getCurrentDateTimeIST } = require('../../getdate/DateAndTime');

const OrderHistory = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
            productStatus: {
                type: String,
                enum: ['DELIVERED', 'REPLACEMENT', 'RETURNED']
            }
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['Credit/Debit Card', 'Net Banking', 'UPI', 'Pay on Delivery'],
        required: true
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        mobileNumber: { type: Number, required: true },
        pincode: { type: Number, required: true },
        houseNo: { type: String, required: true },
        street: { type: String, required: true },
        landmark: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        email: { type: String, required: true }
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
        default: 'PENDING'
    },
    orderDate: { type: String, default: getCurrentDateTimeIST() },
    cancelledStatusUpdatedBy: { type: String },
    cancelledStatusUpdatedTiming: { type: String },
    returnedStatusUpdatedBy: { type: String },
    returnedStatusUpdatedTiming: { type: String },
    cancelOrderReason: { type: String },
    expectedDeliveryDate: { type: String },
    deliveredDate: { type: String },
    returnEndDate: { trype: String },
    refundedAmount: { type: Number },
    replacementNeeded: { type: String },
    replacementStatus: {
        type: String,
        enum: ['PROCESSING', 'COMPLETED']
    },
    notes: { type: String },
    promoCode: { type: String }
});

module.exports = mongoose.model('OrderHistory', OrderHistory);