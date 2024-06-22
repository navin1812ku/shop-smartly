const express = require('express');;
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');
const WishListService = require('../../services/user/WishListService');

const WishListRouter = express.Router();

WishListRouter.post('/user/wishList/:wishListName', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { wishListName } = req.params;
    const wishList = await WishListService.createList(userId, wishListName);
    res.json(wishList);
});

WishListRouter.post('/user/wishList', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    console.log("I am in");
    const { listId, productId, cartProductId } = req.body;
    const wishList = await WishListService.addProduct(userId, listId, productId, cartProductId);
    res.json(wishList);
});

WishListRouter.delete('/user/wishList/:wishListId/:productId', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { wishListId, productId } = req.params;
    const wishList = await WishListService.removeProduct(userId, wishListId, productId);
    res.json(wishList);
});

WishListRouter.delete('/user/wishList/:wishListId', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const { wishListId } = req.params;
    const wishList = await WishListService.removeWishList(userId, wishListId);
    res.json(wishList);
});

WishListRouter.get('/user/wishListDetsils/:wishListId', verifyToken, verifyRole(['USER']), async (req, res) => {
    const { wishListId } = req.params;
    const wishList = await WishListService.getWishList(wishListId);
    res.json(wishList);
});

WishListRouter.get('/user/wishListDetsils', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const wishList = await WishListService.getUserWishList(userId);
    res.json(wishList);
});


module.exports = WishListRouter;