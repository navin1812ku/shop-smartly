const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user/User');
const Admin = require('../models/admins/Admin');
const Vendor = require('../models/vendor/Vendor');
const Courier = require('../models/couriers/Courier');

const LoginService = {
    login: async (details) => {
        try {
            const id = details.id;
            //Admin login check
            if (id.substring(0, 5) === `admin`) {
                const admin = await Admin.findOne({ adminId: details.id });
                if (!admin) {
                    return {
                        success: false,
                        message: `The entered id does not exist`
                    }
                }
                const isMatch = await bcrypt.compare(details.password, admin.adminPassword);
                if (!isMatch) {
                    return {
                        success: false,
                        message: `Password does not match`
                    }
                }
                else {
                    const jwtToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
                    return {
                        success: true,
                        token: jwtToken,
                        details: admin,
                        message: `Welcome back admin ${admin.adminFirstName}${admin.adminLastName}`
                    }
                }
            }
            //Vendor login check
            else if (id.substring(0, 6) === `vendor`) {
                const vendor = await Vendor.findOne({ vendorId: id });
                if (!vendor) {
                    return {
                        success: false,
                        message: `The entered email address does not exist`
                    }
                }
                else {
                    const isMatch = await bcrypt.compare(details.password, vendor.password);
                    if (!isMatch) {
                        return {
                            success: false,
                            message: `Password is incorrect`
                        };
                    }
                    const jwtToken = jwt.sign({ id: vendor._id, role: vendor.role }, process.env.JWT_SECRET);
                    return {
                        success: true,
                        token: jwtToken,
                        details: vendor,
                        message: `Welcome back user ${vendor.firstName}${vendor.lastName}`,
                        passwordNeedToChange: details.password === `vendorpassword` ? true : false
                    };
                }
            }
            //Courier login check
            else if (id.substring(0, 7) === `courier`) {
                const courier = await Courier.findOne({ courierId: id });
                if (!courier) {
                    return {
                        success: false,
                        message: `The entered email address does not exist`
                    }
                }
                else {
                    const isMatch = await bcrypt.compare(details.password, courier.password);
                    if (!isMatch) {
                        return {
                            success: false,
                            message: `Password is incorrect`
                        };
                    }
                    const jwtToken = jwt.sign({ id: courier._id, role: courier.role }, process.env.JWT_SECRET);
                    return {
                        success: true,
                        token: jwtToken,
                        details: courier,
                        message: `Welcome back user ${courier.firstName}${courier.lastName}`,
                        passwordNeedToChange: details.password === `courierpassword` ? true : false
                    };
                }
            }
            //User login check
            else if (id) {
                const user = await User.findOne({ email: details.id });
                if (!user) {
                    return {
                        success: false,
                        message: `The entered email address does not exist`
                    }
                }
                else {
                    const isMatch = await bcrypt.compare(details.password, user.password);
                    if (!isMatch) {
                        return {
                            success: false,
                            message: `Password is incorrect`
                        };
                    }
                    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
                    return {
                        success: true,
                        token: jwtToken,
                        details: user,
                        message: `Welcome back user ${user.firstName}${user.lastName}`
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: `Something went wrong Please try again later`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to login`
            }
        }
    }
}

module.exports = LoginService;