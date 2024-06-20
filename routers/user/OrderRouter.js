const express = require('express');
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');
const OrderService = require('../../services/user/OrderService');

const OrderRouter = express.Router();

//Place order
OrderRouter.post('/user/placeOrder', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const orderDetails = req.body;
    const order = await OrderService.placeOrder(userId, orderDetails);
    res.json(order);
});

//Cancel order
OrderRouter.post('/user/cancelOrder', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const orderCancelDetails = req.body;
    const order = await OrderService.cancelOrder(userId, orderCancelDetails);
    res.json(order);
});


//Check return availability
OrderRouter.post('/user/checkReturnAvailability', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { orderId } = req.body;
    const order = await OrderService.checkReturnAvailability(userId, orderId);
    res.json(order);
});

//Retrun product
OrderRouter.post('/user/returnProduct', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const returnDetails = req.body;
    const order = await OrderService.returnProduct(userId, returnDetails);
    res.json(order);
});

//Check replace availability
OrderRouter.post('/user/checkReplaceAvailability', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const replaceDetails = req.body;
    const order = await OrderService.checkReplaceAvailability(userId, replaceDetails);
    res.json(order);
});

//Replace product
OrderRouter.post('/user/replaceProduct', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const replaceProduct = req.body;
    const order = await OrderService.replaceProduct(userId, replaceProduct);
    res.json(order);
});


module.exports = OrderRouter;