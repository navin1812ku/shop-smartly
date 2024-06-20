const { getCurrentDateTimeIST } = require('../../getdate/DateAndTime');
const Product = require('../../models/products/Product');
const User = require('../../models/user/User');

const ProductService = {
    addProduct: async (productDetails) => {
        try {
            const product = await Product.create(productDetails);
            return {
                success: true,
                message: `Product added to DB`,
                product: product
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to add product`
            }
        }
    },
    updateProduct: async (productId, productDetails) => {
        try {
            const product = await Product.findById(productId);
            console.log(productId, typeof productId, product)
            if (!product) {
                return {
                    success: false,
                    message: `Product not found`
                }
            }
            else {
                product.title = productDetails.title ? productDetails.title : product.title;
                product.description = productDetails.description ? productDetails.description : product.description;
                product.price = productDetails.price ? productDetails.price : product.price;
                product.category = productDetails.category ? productDetails.category : product.category;
                product.brand = productDetails.brand ? productDetails.brand : product.brand;
                product.imageUrl = productDetails.imageUrl ? productDetails.imageUrl : product.imageUrl;
                product.initialQuantity = productDetails.initialQuantity ? productDetails.initialQuantity : product.initialQuantity;
                product.stockQuantity = productDetails.stockQuantity ? productDetails.stockQuantity : product.stockQuantity;
                product.updatedAt = getCurrentDateTimeIST();

                await product.save();

                return {
                    success: true,
                    message: `Product updated`,
                    product: product
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to update product`,
                error: error
            }
        }
    },
    deleteProduct: async (productId) => {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                return {
                    success: false,
                    message: `Product not found`
                }
            }
            else {
                return {
                    success: true,
                    message: `Product deleted`,
                    product: product
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to delete product`
            }
        }
    },
    searchProductName: async (productName) => {
        try {
            // const regex = new RegExp(productName, 'i');
            // const products = await Product.find({
            //     $or: [
            //         { title: regex },
            //         { brand: regex },
            //         { category: regex }
            //     ]
            // });
            const regex = new RegExp(`^${productName}`, 'i');
            const products = await Product.find({
                $or: [
                    { title: { $regex: regex } },
                    { brand: { $regex: regex } },
                    { category: { $regex: regex } }
                ]
            });
            if (products.length > 0) {
                return {
                    success: true,
                    message: `Products that are matched to your product name`,
                    products: products
                }
            }
            else {
                return {
                    success: false,
                    message: `Products not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch products`
            }
        }
    },
    getAllProductByName: async (productName) => {
        try {
            const regex = new RegExp(`^${productName}`, 'i');
            // const products = await Product.find({
            //     $or: [
            //         { title: { $regex: regex } },
            //         { brand: { $regex: regex } },
            //         { category: { $regex: regex } }
            //     ]
            // },'title');
            let products = [];
            const productTitles = await Product.aggregate([
                {
                    $match: {
                        title: { $regex: regex }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: "$title"
                    }
                }
            ]);
            const productBrands = await Product.aggregate([
                {
                    $match: {
                        brand: { $regex: regex }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: "$brand"
                    }
                }
            ]);
            const productCategories = await Product.aggregate([
                {
                    $match: {
                        category: { $regex: regex }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        title: "$category"
                    }
                }
            ]);
            products = products.concat(productTitles, productBrands, productCategories);

            if (products.length > 0) {
                return {
                    success: true,
                    message: `Products that are matched to your product name`,
                    products: products
                }
            }
            else {
                return {
                    success: false,
                    message: `Products not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch products`
            }
        }
    },
    getProducts: async () => {
        try {
            const products = await Product.find();
            if (!products) {
                return {
                    success: false,
                    message: `Products not yet added`
                }
            }
            else {
                return {
                    success: true,
                    message: `Products are fetched`,
                    products: products
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch products`
            }
        }
    },
    searchByProductId: async (productId) => {
        try {
            const product = await Product.findById(productId);
            if (product) {
                return {
                    success: true,
                    message: `Product fetched`,
                    product: product
                }
            }
            else {
                return {
                    success: false,
                    message: `Product not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch products`
            }
        }
    },
    addReview: async (userId, reviewDetails) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const product = await Product.findById(reviewDetails.productId);
                if (!product) {
                    return {
                        success: false,
                        message: `Product not found`
                    }
                }
                else {
                    const reviewIndex = product.reviews.findIndex(review => String(review.userId) === String(userId));
                    if (reviewIndex !== -1) {
                        return {
                            success: false,
                            message: `User id already exists`
                        }
                    }
                    else {
                        const review = {
                            userId: userId,
                            rating: reviewDetails.rating,
                            review: reviewDetails.review
                        }
                        const numberOfReviews = product.reviews.length === 0 ? 1 : product.reviews.length;
                        product.ratings = ((product.ratings * numberOfReviews) + reviewDetails.rating) / (numberOfReviews + 1);
                        product.reviews.push(review);
                        await product.save();
                        return {
                            success: true,
                            message: `Review added`,
                            product: product
                        }
                    }
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to review product`
            }
        }
    },
    removeReview: async (productDetails) => {
        try {
            const product = await Product.findById(productDetails.productId);
            if (!product) {
                return {
                    success: false,
                    message: `Product not found`
                }
            }
            else {
                product.reviews.id(productDetails.reviewId).deleteOne();
                await product.save();
                return {
                    success: true,
                    message: `Review removed`,
                    product: product
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to remove review`
            }
        }
    }
};

module.exports = ProductService;