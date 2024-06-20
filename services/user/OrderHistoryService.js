const User = require("../../models/user/User");
const Product = require("../../models/products/Product");
const OrderHistory = require("../../models/user/OrderHistory");

const OrderHistoryService = {
    getOrderHistory: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const orderHistories = await OrderHistory.find({ userId: userId });
                let orderHistoryDetails = [];
                for (let orderHistory of orderHistories) {
                    let products = [];
                    for (let product of orderHistory.products) {
                        const productDetails = await Product.findById(product.productId);
                        products.push({
                            product: productDetails,
                            quantity: product.quantity,
                            price: product.price,
                            totalPrice: product.totalPrice,
                            productStatus: product.productStatus
                        });
                    }
                    const orderHistoryInfo = {
                        _id: orderHistory._id,
                        userId: orderHistory.userId,
                        orderId: orderHistory.orderId,
                        userName: user.firstName + ` ` + user.lastName,
                        products: products,
                        totalAmount: orderHistory.totalAmount,
                        paymentMethod: orderHistory.paymentMethod,
                        shippingAddress: orderHistory.shippingAddress,
                        orderStatus: orderHistory.orderStatus,
                        orderDate: orderHistory.orderDate,
                        expectedDeliveryDate: orderHistory.expectedDeliveryDate,
                        cancelledStatusUpdatedBy: orderHistory.cancelledStatusUpdatedBy,
                        cancelledStatusUpdatedTiming: orderHistory.cancelledStatusUpdatedTiming,
                        returnedStatusUpdatedBy: orderHistory.returnedStatusUpdatedBy,
                        returnedStatusUpdatedTiming: orderHistory.returnedStatusUpdatedTiming,
                        cancelOrderReason: orderHistory.cancelOrderReason,
                        deliveredDate: orderHistory.deliveredDate,
                        returnEndDate: orderHistory.returnEndDate,
                        refundedAmount: orderHistory.refundedAmount,
                        replacementNeeded: orderHistory.replacementNeeded,
                        replacementStatus: orderHistory.replacementStatus,
                        notes: orderHistory.notes,
                        promoCode: orderHistory.promoCode
                    };
                    orderHistoryDetails.push(orderHistoryInfo);
                }
                return {
                    success: true,
                    message: `Product removed`,
                    orderHistory: orderHistoryDetails
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

module.exports = OrderHistoryService;