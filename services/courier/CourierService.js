const Courier = require("../../models/couriers/Courier");
const bcrypt = require('bcryptjs');
const Order = require("../../models/user/Order");
const Product = require("../../models/products/Product");
const User = require("../../models/user/User");
const { getCurrentDateTimeIST } = require("../../getdate/DateAndTime");
const OrderHistory = require("../../models/user/OrderHistory");

const CourierService = {
    isCourierCanChangePassword: async (courierDBId, oldPassword) => {
        try {
            const courierDetails = await Courier.findById(courierDBId);
            if (courierDetails) {
                const isMatch = await bcrypt.compare(oldPassword, courierDetails.password);
                if (isMatch) {
                    return {
                        success: true,
                        message: `Courier Can Change Password`,
                    };
                }
                else {
                    return {
                        success: false,
                        message: `Password doesn\'t match`
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: `Courier not Found`
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to change password`,
                error: error
            }
        }
    },
    changePassword: async (courierDBId, newPassword) => {
        try {
            const courierDetails = await Courier.findById(courierDBId);
            if (courierDetails) {
                const isMatch = await bcrypt.compare(newPassword, courierDetails.password);
                if (isMatch) {
                    return {
                        success: false,
                        message: `Courier old password matches new password please try another password`
                    };
                }
                else {
                    courierDetails.password = await bcrypt.hash(newPassword, 10);
                    await courierDetails.save();
                    return {
                        success: true,
                        message: `Password changed`,
                        newPassword: newPassword
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: `Courier not Found`
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to change password`
            };
        }
    },
    getOrderById: async (orderId) => {
        try {
            const order = await Order.findById(orderId);
            if (order) {
                const user = await User.findById(order.userId);
                let products = [];
                for (let product of order.products) {
                    const productDetails = await Product.findById(product.productId);
                    products.push({
                        product: productDetails,
                        quantity: product.quantity,
                        price: product.price,
                        totalPrice: product.totalPrice
                    })
                }
                const orderDetails = {
                    userName: user.firstName + ` ` + user.lastName,
                    shippingAddress: order.shippingAddress,
                    products: products,
                    totalAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    orderStatus: order.orderStatus,
                    orderDate: order.orderDate,
                    expectedDeliveryDate: order.expectedDeliveryDate,
                    notes: order.notes,
                    promoCode: order.promoCode
                };
                return {
                    success: true,
                    message: `Order found`,
                    order: orderDetails
                }
            }
            else {
                return {
                    success: false,
                    message: `Order not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch order`,
                error: error
            }
        }
    },
    updateOrderStatus: async (courierDBId, orderStatusDetails) => {
        try {
            const courier = await Courier.findById(courierDBId);
            if (!courier) {
                return {
                    success: false,
                    message: `Vendor not found`
                }
            }
            const order = await Order.findById(orderStatusDetails.orderId);
            if (order) {
                order.orderStatus = orderStatusDetails.orderStatus;
                if (orderStatusDetails.orderStatus === `DELIVERED`) {
                    order.deliveredStatusUpdatedBy = `COURIER ` + courier.firstName + ` ` + courier.lastName;
                    order.deliveredStatusUpdatedTiming = getCurrentDateTimeIST();
                    order.deliveredDate = getCurrentDateTimeIST();
                    for (let product of order.products) {
                        product.productStatus = `DELIVERED`;
                    }
                }
                else if (orderStatusDetails.orderStatus === `CANCELLED`) {
                    order.cancelledStatusUpdatedBy = `COURIER ` + courier.firstName + ` ` + courier.lastName;
                    order.cancelledStatusUpdatedTiming = getCurrentDateTimeIST();
                    order.cancelOrderReason = orderStatusDetails.cancelOrderReason;
                }
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

                    const user = await User.findById(order.userId);
                    user.orderHistory.push(orderHistory._id);
                    await user.save();

                    return {
                        success: true,
                        message: `Order cancelled`,
                        order: order,
                        orderHistory: orderHistory
                    }
                }
            }
            else {
                return {
                    success: false,
                    message: `Order not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to update order status`
            };
        }
    }
};

module.exports = CourierService;