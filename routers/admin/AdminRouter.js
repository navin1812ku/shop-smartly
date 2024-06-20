const express = require('express');

const AdminRouter = express.Router();
const AdminService = require('../../services/admin/AdminService');
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');


//register
AdminRouter.post('/admin/register', async (req, res) => {
    const adminDetails = req.body;
    const admin = await AdminService.adminRegister(adminDetails);
    res.json(admin);
});

//get admin profile
AdminRouter.get('/admin/profile', verifyToken, verifyRole([`ADMIN`]), async (req, res) => {
    try {
        const adminId = req.details.id;
        const adminProfile = await AdminService.getProfile(adminId);
        res.json(adminProfile);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//add vendor
AdminRouter.post('/admin/vendor/add', verifyToken, verifyRole(['ADMIN']), async (req, res) => {
    const adminId = req.details.id;
    const vendorDetails = req.body;
    const vendor = await AdminService.addVendor(adminId, vendorDetails);
    res.json(vendor);
});

//add courier
AdminRouter.post('/admin/courier/add', verifyToken, verifyRole(['ADMIN']), async (req, res) => {
    const adminId = req.details.id;
    const courierDetails = req.body;
    const courier = await AdminService.addCourier(adminId, courierDetails);
    res.json(courier);
});

//remove vendor
AdminRouter.delete('/admin/vendor/:vendorId', verifyToken, verifyRole(['ADMIN']), async (req, res) => {
    const { vendorId } = req.params;
    const vendor = await AdminService.removeVendor(vendorId);
    res.json(vendor);
});

//remove courier
AdminRouter.delete('/admin/courier/:courierId', verifyToken, verifyRole(['ADMIN']), async (req, res) => {
    const { courierId } = req.params;
    const courier = await AdminService.removeCourier(courierId);
    res.json(courier);
});

//get all vendors
AdminRouter.get('/admin/vendors', verifyToken, verifyRole(['ADMIN']), async (req, res) => {
    const vendors = await AdminService.getAllVendors();
    res.json(vendors);
});

//get all couriers
AdminRouter.get('/admin/couriers', verifyToken, verifyRole(['ADMIN']), async (req, res) => {
    const couriers = await AdminService.getAllCouriers();
    res.json(couriers);
});

//get all users
AdminRouter.get('/admin/users', verifyToken, verifyRole(['ADMIN']), async (req, res) => {
    const users = await AdminService.getAllUsers();
    res.json(users);
});

module.exports = AdminRouter;