const express = require('express');
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');
const CartService = require('../../services/cart/CartService');
const CartRouter = express.Router();

CartRouter.get("/cart/addProduct/:productId", verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { productId } = req.params;
    const cart = await CartService.addToCart(userId, productId);
    res.json(cart);
})

CartRouter.delete("/cart/removeProduct/:cartProductId", verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { cartProductId } = req.params;
    const cart = await CartService.removeProduct(userId, cartProductId);
    res.json(cart);
})

CartRouter.get("/cart/products", verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const cart = await CartService.getProducts(userId);
    res.json(cart);
})

module.exports = CartRouter;