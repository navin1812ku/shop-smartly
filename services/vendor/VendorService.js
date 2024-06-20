const { getCurrentDateTimeIST, getCurrentDateTimePlus15DaysIST, getCurrentDateTimeISTForReturnDate } = require("../../getdate/DateAndTime");
const Product = require("../../models/products/Product");
const Order = require("../../models/user/Order");
const OrderHistory = require("../../models/user/OrderHistory");
const User = require("../../models/user/User");
const Vendor = require("../../models/vendor/Vendor");
const bcrypt = require('bcryptjs');

const VendorService = {
    isVendorCanChangePassword: async (vendorDBId, oldPassword) => {
        try {
            const vendorDetails = await Vendor.findById(vendorDBId);
            if (vendorDetails) {
                const isMatch = await bcrypt.compare(oldPassword, vendorDetails.password);
                if (isMatch) {
                    return {
                        success: true,
                        message: `Vendor Can Change Password`,
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
                    message: `Vendor not Found`
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
    changePassword: async (vendorDBId, newPassword) => {
        try {
            const vendorDetails = await Vendor.findById(vendorDBId);
            if (vendorDetails) {
                const isMatch = await bcrypt.compare(newPassword, vendorDetails.password);
                if (isMatch) {
                    return {
                        success: false,
                        message: `Vendor old password matches new password please try another password`
                    };
                }
                else {
                    vendorDetails.password = await bcrypt.hash(newPassword, 10);
                    await vendorDetails.save();
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
                    message: `Vendor not Found`
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
    getOrders: async () => {
        try {
            const orders = await Order.find();
            let ordersDetails = [];
            for (let order of orders) {
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
                    _id: order._id,
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
                ordersDetails.push(orderDetails);
            }
            if (ordersDetails.length > 0) {
                return {
                    success: true,
                    message: `Orders fetched`,
                    orders: ordersDetails
                }
            }
            else {
                return {
                    success: false,
                    message: `No orders found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch orders`,
            };
        }
    },
    updateOrderStatus: async (vendorDBId, orderStatusDetails) => {
        try {
            const vendor = await Vendor.findById(vendorDBId);
            if (!vendor) {
                return {
                    success: false,
                    message: `Vendor not found`
                }
            }
            const order = await Order.findById(orderStatusDetails.orderId);
            if (order) {
                order.orderStatus = orderStatusDetails.orderStatus;
                if (orderStatusDetails.orderStatus === `PROCESSING`) {
                    order.processingStatusUpdatedBy = `VENDOR ` + vendor.firstName + ` ` + vendor.lastName;
                    order.processingStatusUpdatedTiming = getCurrentDateTimeIST();

                    await order.save();
                    return {
                        success: true,
                        message: `Order status updated`,
                        order: order
                    }
                }
                else if (orderStatusDetails.orderStatus === `SHIPPED`) {
                    order.shippedStatusUpdatedBy = `VENDOR ` + vendor.firstName + ` ` + vendor.lastName;
                    order.shippedStatusUpdatedTiming = getCurrentDateTimeIST();
                    order.expectedDeliveryDate = getCurrentDateTimePlus15DaysIST();
                    order.returnEndDate = getCurrentDateTimeISTForReturnDate();

                    await order.save();
                    return {
                        success: true,
                        message: `Order status updated`,
                        order: order
                    }
                }
                else if (orderStatusDetails.orderStatus === `CANCELLED`) {
                    order.cancelledStatusUpdatedBy = `VENDOR ` + vendor.firstName + ` ` + vendor.lastName;
                    order.cancelledStatusUpdatedTiming = getCurrentDateTimeIST();
                    order.cancelOrderReason = orderStatusDetails.cancelOrderReason;
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
                message: `Failed to update order status`,
                error: error
            };
        }
    }
};

module.exports = VendorService;