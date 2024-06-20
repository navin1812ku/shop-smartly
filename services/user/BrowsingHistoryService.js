const { getCurrentDateTimeIST } = require('../../getdate/DateAndTime');
const Product = require('../../models/products/Product');
const BrowsingHistory = require('../../models/user/BrowsingHistory');
const User = require('../../models/user/User');

const BrowsingHistoryService = {
    addProduct: async (userId, productId) => {
        try {
            const product = await Product.findById(productId);
            const user = await User.findById(userId);
            if (!product && !user) {
                return {
                    success: false,
                    message: `Something went wrong please try again later`
                }
            }
            else if (!product) {
                return {
                    success: false,
                    message: `Product unavailable`
                }
            }
            else if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                if (!user.browsingHistory) {
                    console.log(user.browsingHistory);
                    const browsingHistoryOfProduct = await BrowsingHistory.create({
                        userId: userId,
                        viewedProducts: [{
                            productId: product._id
                        }]
                    });
                    console.log(user.browsingHistory);
                    user.browsingHistory = browsingHistoryOfProduct._id;
                    await user.save();

                    return {
                        success: true,
                        message: `Product added to browsing history`,
                        browsingHistory: browsingHistoryOfProduct
                    }
                }
                else {
                    const browsingHistory = await BrowsingHistory.findOne({
                        userId: userId
                    });
                    const productIndex = browsingHistory.viewedProducts.findIndex(viewedProduct => viewedProduct.productId == String(product._id));
                    if (productIndex !== -1) {
                        browsingHistory.viewedProducts.splice(productIndex, 1);
                        await browsingHistory.save();
                        browsingHistory.viewedProducts.push({ productId: product._id, viewedAt: getCurrentDateTimeIST() });
                        await browsingHistory.save();
                    } else {
                        browsingHistory.viewedProducts.push({ productId: product._id, viewedAt: getCurrentDateTimeIST() });
                        await browsingHistory.save();
                    }

                    return {
                        success: true,
                        message: `Product added to browsing history`,
                        browsingHistory: browsingHistory
                    }
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to add browse history`
            }
        }
    },
    removeProduct: async (userId, viewedProductId) => {
        try {
            const user = await User.findById(userId);
            const browseHistory = await BrowsingHistory.findOne({ userId: userId });
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else if (!browseHistory) {
                return {
                    success: false,
                    message: `User browse history found`
                }
            }
            else {
                browseHistory.viewedProducts.remove({ _id: viewedProductId });
                await browseHistory.save();
                return {
                    success: true,
                    message: `Product removed from browse history`,
                    browseHistory: browseHistory
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to remove browse history product`
            }
        }
    },
    getBrowsingHistory: async (userId) => {
        try {
            const user = await User.findById(userId);
            const browseHistory = await BrowsingHistory.findById(user.browsingHistory);
            let products = [];
            for (let product of browseHistory.viewedProducts) {
                const productDetails = await Product.findById(product.productId);
                products.push({
                    product: productDetails,
                    viewedAt: product.viewedAt
                })
            }
            const browseHistoryDetails = {
                _id: browseHistory._id,
                userId: browseHistory.userId,
                viewedProducts: products

            };
            if (browseHistoryDetails) {
                return {
                    success: true,
                    message: `Browsing history found`,
                    browseHistory: browseHistoryDetails
                }
            }
            else {
                return {
                    success: false,
                    message: `Browsing history not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch browse history`
            }
        }
    }
};

module.exports = BrowsingHistoryService;