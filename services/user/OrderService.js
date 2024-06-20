const Order = require('../../models/user/Order');
const User = require('../../models/user/User');
const Product = require('../../models/products/Product');
const OrderHistory = require('../../models/user/OrderHistory');
const PromoCode = require('../../models/promocodemodel/PromoCode');
const { getCurrentDateTimeIST, isFirstDateBeforeSecondDate } = require('../../getdate/DateAndTime');


const OrderService = {
    placeOrder: async (userId, orderDetails) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                let products = [];
                let totalAmount = 0;
                for (let productDetails of orderDetails.productIds) {
                    const product = await Product.findById(productDetails.productId);
                    products.push({
                        productId: productDetails.productId,
                        quantity: productDetails.quantity,
                        price: product.price,
                        totalPrice: productDetails.quantity * product.price
                    })
                    totalAmount += productDetails.quantity * product.price;
                    product.stockQuantity = product.stockQuantity - productDetails.quantity;
                    await product.save();
                }

                if (orderDetails.promoCode) {
                    const promoCode = await PromoCode.findOne({ promoCode: orderDetails.promoCode });
                    totalAmount -= (totalAmount * (promoCode.discount / 100));
                }

                const userAddress = orderDetails.address;

                const shippingAddress = {
                    fullName: userAddress.fullName,
                    mobileNumber: userAddress.mobileNumber,
                    pincode: userAddress.pincode,
                    houseNo: userAddress.houseNo,
                    street: userAddress.street,
                    landmark: userAddress.landmark,
                    city: userAddress.city,
                    state: userAddress.state,
                    country: userAddress.country,
                    email: user.email
                }

                const order = await Order.create({
                    userId: userId,
                    products: products,
                    totalAmount: totalAmount,
                    paymentMethod: orderDetails.paymentMethod,
                    shippingAddress: shippingAddress,
                    notes: orderDetails.notes,
                    promoCode: orderDetails.promoCode ? orderDetails.promoCode : null
                })

                return {
                    success: true,
                    message: `Order placed`,
                    orderDetails: order
                }
            }
        }
        catch (error) {
            return {
                succcess: false,
                message: `Failed to place order`
            }
        }
    },
    cancelOrder: async (userId, orderCancelDetails) => {
        try {
            const order = await Order.findById(orderCancelDetails.orderId);
            const user = await User.findById(userId);
            if (!order) {
                return {
                    success: false,
                    message: `Order not found`
                }
            }
            else if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                order.orderStatus = orderCancelDetails.orderStatus;
                order.cancelledStatusUpdatedBy = `USER ` + user.firstName + ` ` + user.lastName;
                order.cancelledStatusUpdatedTiming = getCurrentDateTimeIST();
                order.cancelOrderReason = orderCancelDetails.cancelOrderReason;
                await order.save();

                const orderHistories = await OrderHistory.findOne({ orderId: order._id });
                if (orderHistories) {
                    const orderHistory = await OrderHistory.findOneAndUpdate(
                        {
                            orderId: order._id
                        },
                        {
                            userId: order.userId,
                            orderId: order._id,
                            products: order.products,
                            totalAmount: order.totalAmount,
                            paymentMethod: order.paymentMethod,
                            shippingAddress: order.shippingAddress,
                            orderStatus: order.orderStatus,
                            cancelledStatusUpdatedBy: order.cancelledStatusUpdatedBy,
                            cancelledStatusUpdatedTiming: order.cancelledStatusUpdatedTiming,
                            cancelOrderReason: order.cancelOrderReason,
                            orderDate: order.orderDate,
                            expectedDeliveryDate: order.expectedDeliveryDate,
                            deliveredDate: order.deliveredDate ? order.deliveredDate : null,
                            returnEndDate: order.returnEndDate ? order.returnEndDate : null,
                            refundedAmount: order.refundedAmount ? order.refundedAmount : null,
                            replacementNeeded: order.replacementNeeded ? order.replacementNeeded : null,
                            replacementStatus: order.replacementStatus ? order.replacementStatus : null,
                            notes: order.notes,
                            promoCode: order.promoCode
                        }
                    )
                    return {
                        success: true,
                        message: `Order status updated`,
                        order: order,
                        orderHistory: orderHistory
                    }
                }
                else {
                    const orderHistory = await OrderHistory.create({
                        userId: order.userId,
                        orderId: order._id,
                        products: order.products,
                        totalAmount: order.totalAmount,
                        paymentMethod: order.paymentMethod,
                        shippingAddress: order.shippingAddress,
                        orderStatus: order.orderStatus,
                        cancelledStatusUpdatedBy: order.cancelledStatusUpdatedBy,
                        cancelledStatusUpdatedTiming: order.cancelledStatusUpdatedTiming,
                        cancelOrderReason: order.cancelOrderReason,
                        orderDate: order.orderDate,
                        expectedDeliveryDate: order.expectedDeliveryDate,
                        deliveredDate: order.deliveredDate ? order.deliveredDate : null,
                        returnEndDate: order.returnEndDate ? order.returnEndDate : null,
                        refundedAmount: order.refundedAmount ? order.refundedAmount : null,
                        replacementNeeded: order.replacementNeeded ? order.replacementNeeded : null,
                        replacementStatus: order.replacementStatus ? order.replacementStatus : null,
                        notes: order.notes,
                        promoCode: order.promoCode
                    });

                    user.orderHistory.push(orderHistory._id);
                    await user.save();

                    return {
                        success: true,
                        message: `Order status updated`,
                        orderHistory: orderHistory
                    }
                }
            }
        }
        catch (error) {
            return {
                succcess: false,
                message: `Failed to cancel order`
            }
        }
    },
    checkReturnAvailability: async (userId, orderId) => {
        try {
            const order = await Order.findById(orderId);
            const user = await User.findById(userId);
            if (!order) {
                return {
                    success: false,
                    message: `Order not found`
                }
            }
            else if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                if (!isFirstDateBeforeSecondDate(getCurrentDateTimeIST(), order.returnEndDate)) {
                    return {
                        success: true,
                        message: `Return date expired`
                    }
                }
                else {
                    let products = [];
                    for (let productDetails of order.products) {
                        const product = await Product.findById(productDetails.productId);
                        products.push({
                            productInfo: productDetails,
                            product: product.title,
                            available: product.returnAvailable ? `YES` : `NO`
                        });
                    }
                    return {
                        success: true,
                        message: `Product list`,
                        productsAvailable: {
                            orderId: order._id,
                            products: products
                        }
                    }
                }
            }
        }
        catch (error) {
            return {
                succcess: false,
                message: `Failed to return product`
            }
        }
    },
    returnProduct: async (userId, returnDetails) => {
        try {
            const order = await Order.findById(returnDetails.orderId);
            const user = await User.findById(userId);
            if (!order) {
                return {
                    success: false,
                    message: `Order not found`
                }
            }
            else if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                let totalRefundAmount = 0;
                for (let productDetails of returnDetails.products) {
                    if (productDetails.available === `YES`) {
                        const product = await Product.findById(productDetails.productInfo.productId);
                        product.stockQuantity = product.stockQuantity + productDetails.productInfo.quantity;
                        totalRefundAmount += productDetails.productInfo.totalPrice;
                        order.products.id(productDetails.productInfo._id).productStatus = `RETURNED`;
                    }
                }
                order.refundedAmount = totalRefundAmount;
                await order.save();
                return {
                    success: true,
                    message: `Product refunded`,
                    order: order,
                    totalRefundAmount: totalRefundAmount
                }
            }
        }
        catch (error) {
            return {
                succcess: false,
                message: `Failed to return product`
            }
        }
    },
    checkReplaceAvailability: async (userId, replaceDetails) => {
        try {
            const order = await Order.findById(replaceDetails.orderId);
            const user = await User.findById(userId);
            if (!order) {
                return {
                    success: false,
                    message: `Order not found`
                }
            }
            else if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                if (!isFirstDateBeforeSecondDate(getCurrentDateTimeIST(), order.returnEndDate)) {
                    return {
                        success: true,
                        message: `Return date expired`
                    }
                }
                else {
                    let products = [];
                    for (let productDetails of order.products) {
                        const product = await Product.findById(productDetails.productId);
                        products.push({
                            productInfo: productDetails,
                            product: product.title,
                            available: product.replaceAvailable ? `YES` : `NO`
                        });
                    }
                    return {
                        success: true,
                        message: `Product list`,
                        productsAvailable: {
                            orderId: order._id,
                            products: products
                        }
                    }
                }
            }
        }
        catch (error) {
            return {
                succcess: false,
                message: `Failed to return product`
            }
        }
    },
    replaceProduct: async (userId, replaceDetails) => {
        try {
            const order = await Order.findById(replaceDetails.orderId);
            const user = await User.findById(userId);
            if (!order) {
                return {
                    success: true,
                    message: `Order not found`
                }
            }
            else if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                for (let productDetails of replaceDetails.products) {
                    if (productDetails.available === `YES`) {
                        const product = await Product.findById(productDetails.productInfo.productId);
                        order.products.id(productDetails.productInfo._id).productStatus = `REPLACEMENT`;
                    }
                }
                order.replacementNeeded = true;
                order.replacementStatus = `PROCESSING`;
                await order.save();
                return {
                    success: true,
                    message: `Product refunded`,
                    order: order
                }
            }
        }
        catch (error) {
            return {
                succcess: false,
                message: `Failed to replace product`
            }
        }
    }
};

module.exports = OrderService;