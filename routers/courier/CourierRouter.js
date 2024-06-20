const express = require('express');
const CourierRouter = express.Router();
const CourierService = require("../../services/courier/CourierService");
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');

//check the old password
CourierRouter.post('/courier/canChangePassword', verifyToken, verifyRole(['COURIER']), async (req, res) => {
    const courierDBId = req.details.id;
    const { oldPassword } = req.body;
    const courier = await CourierService.isCourierCanChangePassword(courierDBId, oldPassword);
    res.json(courier);
});

//change password
CourierRouter.post('/courier/changePassword', verifyToken, verifyRole(['COURIER']), async (req, res) => {
    const courierDBId = req.details.id;
    const { newPassword } = req.body;
    const courier = await CourierService.changePassword(courierDBId, newPassword);
    res.json(courier);
});

//search order
CourierRouter.get('/courier/searchOrder/:orderId', verifyToken, verifyRole(['COURIER']), async (req, res) => {
    const { orderId } = req.params;
    const courier = await CourierService.getOrderById(orderId);
    res.json(courier);
});

CourierRouter.post('/courier/updateOrderStatus', verifyToken, verifyRole(['COURIER']), async (req, res) => {
    const courierDBId = req.details.id;
    const orderStatusDetails = req.body;
    const courier = await CourierService.updateOrderStatus(courierDBId, orderStatusDetails);
    res.json(courier);
});


module.exports = CourierRouter;