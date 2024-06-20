// models/Courier.js
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

const Courier = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    courierId: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    governmentId: { type: String, required: true },
    companyName: { type: String, required: true },
    startDate: { type: String, default: getCurrentDateTimeIST() },
    vehicleType: { type: String, required: true },
    vehicleRegistrationNumber: { type: String, required: true },
    vehicleMakeModel: { type: String, required: true },
    insuranceDetails: { type: String, required: true },
    homeBaseLocation: { type: Address, required: true },
    shiftTimings: { type: String, required: true },
    availability: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'On-Demand', 'Shift-Based', 'Seasonal', 'Temporary', 'Weekend-Only', 'Night-Only', 'Specific Days', 'Peak Hours', 'Holiday Availability', 'Standby/Backup'],
        required: true,
        default: `Full-Time`
    },
    deliveryHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderHistory'
    },
    performanceRatings: { type: Number, min: 0, max: 5 },
    onTimeDeliveryRate: { type: Number, min: 0, max: 100 },
    completionRate: { type: Number, min: 0, max: 100 },
    deviceDetails: { type: String, required: true },
    backgroundCheckStatus: {
        type: String,
        enum: ['Completed', 'Incomplete'],
        required: true
    },
    certificationsTraining: { type: String },
    addBy: { type: String, required: true }
});

module.exports = mongoose.model('Courier', Courier);


