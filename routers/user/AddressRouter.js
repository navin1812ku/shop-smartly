const express = require('express');
const User = require('../../models/user/User');
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');
const AddressService = require('../../services/user/AddressService');

const AddressRouter = express.Router();

AddressRouter.post('/user/address', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const address = req.body;
    const userDetails = await AddressService.addAddress(userId, address);
    res.json(userDetails);
});

AddressRouter.get('/user/address', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const userAddresses = await AddressService.getAddresses(userId);
    res.json(userAddresses);
});

AddressRouter.post('/user/address/:addressId', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { addressId } = req.params;
    const address = req.body;
    const addressDetails = await AddressService.updateAddress(userId, addressId, address);
    res.json(addressDetails);
});

AddressRouter.delete('/user/address/:addressId', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { addressId } = req.params;
    const user = await AddressService.deleteAddress(userId, addressId);
    res.json(user);
})

AddressRouter.post('/user/setDefaultAddress', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const address = req.body;
    const userDetails = await AddressService.setDefaultAddress(userId, address);
    res.json(userDetails);
});


module.exports = AddressRouter;