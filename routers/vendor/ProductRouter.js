const express = require('express');

const ProductRouter = express.Router();
const { verifyToken } = require('../../middleware/Authentication');
const { verifyRole } = require('../../middleware/Authorization');
const ProductService = require('../../services/vendor/ProductService');

ProductRouter.post('/product/add', verifyToken, verifyRole(['ADMIN', 'VENDOR']), async (req, res) => {
    const product = req.body;
    const productList = await ProductService.addProduct(product);
    res.json(productList);
});

ProductRouter.post('/product/update', verifyToken, verifyRole(['ADMIN', 'VENDOR']), async (req, res) => {
    const productDetails = req.body;
    const productList = await ProductService.updateProduct(productDetails.productId, productDetails);
    res.json(productList);
});

ProductRouter.delete('/product/:productId', verifyToken, verifyRole(['ADMIN', 'VENDOR']), async (req, res) => {
    const { productId } = req.params;
    const productList = await ProductService.deleteProduct(productId);
    res.json(productList);
});

ProductRouter.get('/product/set', verifyToken, verifyRole(['ADMIN', 'VENDOR', 'USER']), async (req, res) => {
    const productList = await ProductService.getProducts();
    res.json(productList);
});

ProductRouter.get('/product/byId/:productId', verifyToken, verifyRole(['ADMIN', 'VENDOR']), async (req, res) => {
    const { productId } = req.params;
    const product = await ProductService.searchByProductId(productId);
    res.json(product);
});

ProductRouter.post('/product/addReview', verifyToken, verifyRole(['USER']), async (req, res) => {
    const userId = req.details.id;
    const reviewDetails = req.body;
    const product = await ProductService.addReview(userId, reviewDetails);
    res.json(product);
});

ProductRouter.post('/product/removeReview', verifyToken, verifyRole(['ADMIN', 'VENDOR']), async (req, res) => {
    const productDetails = req.body;
    const product = await ProductService.removeReview(productDetails);
    res.json(product);
});

ProductRouter.get('/product/searchProduct/:name', verifyToken, verifyRole(['ADMIN', 'VENDOR', 'USER']), async (req, res) => {
    const { name } = req.params;
    const products = await ProductService.searchProductName(name);
    res.json(products);
});

ProductRouter.get('/product/search/:productName', verifyToken, verifyRole(['ADMIN', 'USER', 'VENDOR']), async (req, res) => {
    const { productName } = req.params;
    const productList = await ProductService.getAllProductByName(productName);
    res.json(productList);
});


module.exports = ProductRouter;