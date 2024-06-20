const express = require('express');
const User = require('../../models/user/User');
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');
const BrowsingHistoryService = require('../../services/user/BrowsingHistoryService');

const BrowsingHistoryRouter = express.Router();

BrowsingHistoryRouter.post('/browseHistory/:productId', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { productId } = req.params;
    const browseHistory = await BrowsingHistoryService.addProduct(userId, productId);
    res.json(browseHistory);
});

BrowsingHistoryRouter.delete('/browseHistory/:viewedProductId', verifyToken, verifyRole(['USER']), async (req, res) => {
    const { viewedProductId } = req.params;
    const userId = req.details.id;
    const browseHistory = await BrowsingHistoryService.removeProduct(userId, viewedProductId);
    res.json(browseHistory);
});

BrowsingHistoryRouter.get('/browseHistory/get', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const browseHistory = await BrowsingHistoryService.getBrowsingHistory(userId);
    res.json(browseHistory);
});

module.exports = BrowsingHistoryRouter;