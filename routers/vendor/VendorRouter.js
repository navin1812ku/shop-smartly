const express = require('express');;
const VendorRouter = express.Router();
const VendorService = require("../../services/vendor/VendorService");
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');

//check the old password
VendorRouter.post('/vendor/canChangePassword', verifyToken, verifyRole(['VENDOR']), async (req, res) => {
    const vendorDBId = req.details.id;
    const { oldPassword } = req.body;
    const vendor = await VendorService.isVendorCanChangePassword(vendorDBId, oldPassword);
    res.json(vendor);
});

//change password
VendorRouter.post('/vendor/changePassword', verifyToken, verifyRole(['VENDOR']), async (req, res) => {
    const vendorDBId = req.details.id;
    const { newPassword } = req.body;
    const vendor = await VendorService.changePassword(vendorDBId, newPassword);
    res.json(vendor);
});

//get all orders
VendorRouter.get('/vendor/orderSet', verifyToken, verifyRole(['VENDOR']), async (req, res) => {
    const vendor = await VendorService.getOrders();
    res.json(vendor);
});

VendorRouter.post('/vendor/updateOrderStatus', verifyToken, verifyRole(['VENDOR']), async (req, res) => {
    const vendorDBId = req.details.id;
    const orderStatusDetails = req.body;
    const vendor = await VendorService.updateOrderStatus(vendorDBId, orderStatusDetails);
    res.json(vendor);
});

module.exports = VendorRouter;