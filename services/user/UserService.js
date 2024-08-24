const bcrypt = require('bcryptjs');
const User = require('../../models/user/User');
const MailSender = require('../../sendmail/MailSender');
const Order = require('../../models/user/Order');
const Product = require('../../models/products/Product');

const UserService = {
    register: async (userDetails) => {
        try {
            const hashedPassword = await bcrypt.hash(userDetails.password, 10);
            const newUser = await User.create({
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                password: hashedPassword,
                phoneNumber: userDetails.phoneNumber,
                role: process.env.ROLE_USER
            });
            return {
                success: true,
                message: `User registered`,
                user: newUser
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to register`
            };
        }
    },
    getUserDetails: async (userId) => {
        try {
            const userDetails = await User.findById(userId);
            console.log(userDetails);
            return {
                success: true,
                message: `Fetched user details`,
                details: userDetails
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Something went wrong please try again later`
            };
        }
    },
    profileUpdate: async (userId, profileDetails) => {
        try {
            const userDetails = await User.findById(userId);
            if (!userDetails) {
                return {
                    success: false,
                    message: `USer not found`
                }
            }
            else {
                userDetails.firstName = profileDetails.firstName ? profileDetails.firstName : userDetails.firstName;
                userDetails.lastName = profileDetails.lastName ? profileDetails.lastName : userDetails.lastName;
                userDetails.email = profileDetails.email ? profileDetails.email : userDetails.email;
                userDetails.phoneNumber = profileDetails.phoneNumber ? profileDetails.phoneNumber : userDetails.phoneNumber;
                userDetails.save();
                return {
                    success: true,
                    message: `Profile Updated`,
                    details: userDetails
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to update user profile`
            }
        }
    },
    isUserCanChangePassword: async (userId, oldPassword) => {
        try {
            const userDetails = await User.findById(userId);
            if (userDetails) {
                const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
                if (isMatch) {
                    return {
                        success: true,
                        message: `User Can Change Password`
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
                    message: `User not Found`
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to change password`
            }
        }
    },
    changePassword: async (userId, newPassword) => {
        try {
            const userDetails = await User.findById(userId);
            if (userDetails) {
                const isMatch = await bcrypt.compare(newPassword, userDetails.password);
                if (isMatch) {
                    return {
                        success: false,
                        message: `User old password matches new password please try another password`
                    };
                }
                else {
                    userDetails.password = await bcrypt.hash(newPassword, 10);
                    await userDetails.save();
                    return {
                        success: true,
                        message: `Password changed`
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: `User not Found`
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
    isUserExists: async (email) => {
        try {
            const userDetails = await User.findOne({ email: email });
            const code = generateCode();
            if (userDetails) {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: userDetails.email,
                    subject: `Froget Password`,
                    text: `Forget password code: ${code}`
                };
                MailSender.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`Error occurred: `, error);
                    } else {
                        console.log(`Email sent: `, info.response);
                    }
                });
                return {
                    success: true,
                    message: `User Found`,
                    code: code
                }
            }
            else {
                return {
                    success: true,
                    message: `User Not Found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to change password`
            }
        }
    },
    isCodeMatches: async (codeDetails) => {
        try {
            if (codeDetails.codeSend === codeDetails.codeTyped) {
                return {
                    success: true,
                    message: `Code matched`
                }
            }
            else {
                return {
                    success: false,
                    message: `Code does not matches`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to check code`
            }
        }
    },
    forgetPassword: async (email, newPassword) => {
        try {
            const userDetails = await User.findOne({ email: email });
            if (userDetails) {
                const isMatch = await bcrypt.compare(newPassword, userDetails.password);
                if (isMatch) {
                    return {
                        success: false,
                        message: `User old password matches new password please try another password`
                    };
                }
                else {
                    userDetails.password = await bcrypt.hash(newPassword, 10);
                    await userDetails.save();
                    return {
                        success: true,
                        message: `Password changed successfully`
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: `User not Found`
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed change password`
            };
        }
    },
    getUserOrders: async (userId) => {
        try {
            const orders = await Order.find({ userId: userId });
            const user = await User.findById(userId);
            if (orders) {
                let ordersDetails = [];
                for (let order of orders) {
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
                return {
                    success: true,
                    message: `Orders fetched`,
                    orders: ordersDetails
                }
            }
            else {
                return {
                    success: false,
                    message: `No order found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch order`
            };
        }
    }
}

//forget password code generator
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = UserService;