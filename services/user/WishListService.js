const WishList = require('../../models/user/WishList');
const User = require('../../models/user/User');
const Product = require('../../models/products/Product');
const Cart = require('../../models/carts/Cart');

const WishListService = {
    createList: async (userId, wishListName) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const list = await WishList.findOne({
                    $and: [
                        { userId: userId },
                        { name: wishListName }
                    ]
                })
                if (list) {
                    return {
                        success: false,
                        message: `Wish list name already exists`
                    }
                }
                else {
                    const wishList = await WishList.create({
                        userId: userId,
                        name: wishListName,
                        products: []
                    });
                    user.wishList.push(wishList._id);
                    await user.save();
                    return {
                        success: true,
                        message: `List created`,
                        wishList: wishList
                    }
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to create list`
            }
        }
    },
    getWishList: async (wishListId) => {
        try {
            const wishList = await WishList.findById(wishListId);
            if (!wishList) {
                return {
                    success: false,
                    message: `Wish List not found`
                }
            }
            else {
                let products = [];
                for (let product of wishList.products) {
                    const productDetails = await Product.findById(product.product);
                    products.push( productDetails);
                }
                const wishListDetails = {
                    _id: wishList._id,
                    userId: wishList.userId,
                    name: wishList.name,
                    products: products
                };
                return {
                    success: true,
                    message: `Wish list fetched`,
                    wishList: wishListDetails
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch list`
            }
        }
    },
    addProduct: async (userId, wishListId, productId, cartProductId) => {
        try {
            const user = await User.findById(userId);
            const product = await Product.findById(productId);
            const cart = await Cart.findById(user.cart);
            const wishList = await WishList.findById(wishListId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else if (!product) {
                return {
                    success: false,
                    message: `Product not found`
                }
            }
            else if (!wishList) {
                return {
                    success: false,
                    message: `Wish list not found`
                }
            } else if (!cart) {
                return {
                    success: false,
                    message: `Cart not found`
                }
            }
            else {
                console.log(cartProductId);
                console.log(cart);
                console.log(wishList);
                wishList.products.push({
                    product: product._id
                });
                await wishList.save();
                cart.products.id(cartProductId).deleteOne();
                await cart.save();
                return {
                    success: true,
                    message: `Product added to the list`,
                    wishList: wishList
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to add product to list`
            }
        }
    },
    removeProduct: async (userId, wishListId, productId) => {
        try {
            const user = await User.findById(userId);
            const wishList = await WishList.findById(wishListId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else if (!wishList) {
                return {
                    success: false,
                    message: `Wish list not found`
                }
            }
            else {
                wishList.products.id(productId).deleteOne();
                await wishList.save();
                return {
                    success: false,
                    message: `Product removed from the list`,
                    wishList: wishList
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to remove product`
            }
        }
    },
    removeWishList: async (userId, wishListId) => {
        try {
            const wishList = await WishList.findByIdAndDelete(wishListId);
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const index = user.wishList.findIndex(list => String(list) === String(wishListId));
                console.log(index);
                if (index !== -1) {
                    user.wishList.splice(index, 1);
                    await user.save();
                    return {
                        success: true,
                        message: `List is removed`,
                        wishList: wishList
                    }
                }
                else {
                    return {
                        success: false,
                        message: `Wish list not found`
                    }
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to remove list`
            }
        }
    },
    getUserWishList: async (userId) => {
        try {
            const wishList = await WishList.find({ userId: userId });
            if (wishList.length>0) {
                return {
                    success: true,
                    message: `Fetched wish list`,
                    wishList: wishList
                }
            }
            else {
                return {
                    success: false,
                    message: `No wish list created`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch list`
            }
        }
    }
}

module.exports = WishListService;