const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    adminFirstName: { type: String, required: true },
    adminLastName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminId: { type: String, required: true },
    adminPassword: { type: String, required: true },
    adminPhoneNumber: { type: String, required: true },
    role: { type: String, required: true }
});

module.exports = mongoose.model('admin', AdminSchema);