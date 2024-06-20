const express = require('express');
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');
const OrderHistoryService = require('../../services/user/OrderHistoryService');

const OrderHistoryRouter = express.Router();

OrderHistoryRouter.get('/orderHistory/set', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const orderHistories = await OrderHistoryService.getOrderHistory(userId);
    res.json(orderHistories);
});

module.exports = OrderHistoryRouter;