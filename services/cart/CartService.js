const Cart = require("../../models/carts/Cart");
const User = require("../../models/user/User");
const Product = require("../../models/products/Product");


const CartService = {
    addToCart: async (userId, productId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const cart = await Cart.findById(user.cart);
                if (!cart) {
                    const newCart = await Cart.create({
                        userId: userId,
                        products: [
                            {
                                productId: productId
                            }
                        ]
                    });
                    user.cart = newCart._id;
                    await user.save();
                    return {
                        success: true,
                        message: `Added to cart`,
                        cart: newCart
                    }
                }
                else {
                    const index = cart.products.findIndex(product => String(product.productId) === String(productId));
                    if (index !== -1) {
                        return {
                            success: false,
                            message: `Product already added to cart`,
                        }
                    }
                    else {
                        cart.products.push({
                            productId: productId
                        });
                        await cart.save();
                        return {
                            success: true,
                            message: `Added to cart`,
                            cart: cart
                        }
                    }
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to add to cart`
            }
        }
    },
    removeProduct: async (userId, cartProductId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const cart = await Cart.findById(user.cart);
                cart.products.id(cartProductId).deleteOne();
                await cart.save();
                return {
                    success: true,
                    message: `Product removed`,
                    cart: cart
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to remove product from cart`
            }
        }
    },
    getProducts: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const cart = await Cart.findById(user.cart);
                let products = [];
                for (let product of cart.products) {
                    const productDetails = await Product.findById(product.productId);
                    products.push({
                        cartProductId: product._id,
                        product: productDetails
                    });
                }
                return {
                    success: true,
                    message: `Product removed`,
                    cart: {
                        _id: cart._id,
                        products: products
                    }
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to remove product from cart`
            }
        }
    }
};

module.exports = CartService;