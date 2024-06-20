const bcrypt = require('bcryptjs');
const Admin = require('../../models/admins/Admin');
const Vendor = require('../../models/vendor/Vendor');
const { randomNumber } = require('./RandomNumberGenerator');
const Courier = require('../../models/couriers/Courier');
const User = require('../../models/user/User');

const AdminService = {
    adminRegister: async (adminDetails) => {
        try {
            const isAdmin = await Admin.findOne({ adminEmail: adminDetails.adminEmail });
            if (isAdmin) {
                return {
                    success: false,
                    message: `Admin with this id: ${adminDetails.adminEmail} already exists`
                }
            }
            else {
                let adminId;
                let adminExists;
                do {
                    adminId = `admin` + randomNumber();
                    adminExists = await Admin.findOne({ adminID: adminId });
                } while (adminExists)
                const password = await bcrypt.hash(adminDetails.adminPassword, 10);
                const admin = await Admin.create({
                    adminFirstName: adminDetails.adminFirstName,
                    adminLastName: adminDetails.adminLastName,
                    adminEmail: adminDetails.adminEmail,
                    adminId: adminId,
                    adminPassword: password,
                    adminPhoneNumber: adminDetails.adminPhoneNumber,
                    role: process.env.ROLE_ADMIN
                });
                return {
                    success: true,
                    message: `Admin registers successfully`,
                    details: admin
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to register`,
                error: error
            }
        }
    },
    getProfile: async (adminId) => {
        try {
            const adminProfile = await Admin.findById(adminId);
            return {
                success: true,
                message: `Fetched user details`,
                details: adminProfile
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Something went wrong please try again later`
            };
        }
    },
    addVendor: async (adminId, vendorDetails) => {
        try {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return {
                    success: false,
                    message: `Admin not found`
                }
            }
            let vendorExist;
            let vendorId;
            do {
                vendorId = `vendor` + randomNumber();
                vendorExist = await Vendor.findOne({ vendorId: vendorId });
            } while (vendorExist);
            const password = await bcrypt.hash(vendorDetails.password, 10);
            const vendor = await Vendor.create({
                firstName: vendorDetails.firstName,
                lastName: vendorDetails.lastName,
                vendorId: vendorId,
                email: vendorDetails.email,
                password: password,
                address: vendorDetails.address,
                brandOfVendor: vendorDetails.brandOfVendor,
                phone: vendorDetails.phone,
                addBy: admin.adminFirstName + ` ` + admin.adminLastName,
                role: process.env.ROLE_VENDOR
            });
            return {
                success: true,
                message: `Vendor added`,
                vendor: vendor
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to add vendor`
            }
        }
    },
    addCourier: async (adminId, courierDetails) => {
        try {
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return {
                    success: false,
                    message: `Admin not found`
                }
            }
            let courierExist;
            let courierId;
            do {
                courierId = `courier` + randomNumber();
                courierExist = await Courier.findOne({ courierId: courierId });
            } while (courierExist);
            const password = await bcrypt.hash(courierDetails.password, 10);
            const courier = await Courier.create({
                firstName: courierDetails.firstName,
                lastName: courierDetails.lastName,
                contactNumber: courierDetails.contactNumber,
                emailAddress: courierDetails.emailAddress,
                courierId: courierId,
                password: password,
                role: process.env.ROLE_COURIER,
                governmentId: courierDetails.governmentId,
                companyName: courierDetails.companyName,
                vehicleType: courierDetails.vehicleType,
                vehicleRegistrationNumber: courierDetails.vehicleRegistrationNumber,
                vehicleMakeModel: courierDetails.vehicleMakeModel,
                insuranceDetails: courierDetails.insuranceDetails,
                homeBaseLocation: courierDetails.homeBaseLocation,
                shiftTimings: courierDetails.shiftTimings,
                availability: courierDetails.availability,
                deviceDetails: courierDetails.deviceDetails,
                backgroundCheckStatus: courierDetails.backgroundCheckStatus,
                certificationsTraining: courierDetails.certificationsTraining,
                addBy: admin.adminFirstName + ` ` + admin.adminLastName
            });
            return {
                success: true,
                message: `Courier added`,
                courier: courier
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to add courier`
            }
        }
    },
    removeVendor: async (vendorId) => {
        try {
            const vendor = await Vendor.findByIdAndDelete(vendorId);
            return {
                success: true,
                message: `Vendor deleted`,
                vendor: vendor
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to delete vendor`
            }
        }
    },
    removeCourier: async (courierId) => {
        try {
            const courier = await Courier.findByIdAndDelete(courierId);
            return {
                success: true,
                message: `Vendor deleted`,
                courier: courier
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to delete courier`
            }
        }
    },
    getAllVendors: async () => {
        try {
            const vendors = await Vendor.find();
            if (vendors) {
                return {
                    success: true,
                    message: `All vendors`,
                    vendors: vendors
                }
            }
            else {
                return {
                    success: false,
                    message: `Vendors not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch vendors`
            }
        }
    },
    getAllCouriers: async () => {
        try {
            const couriers = await Courier.find();
            if (couriers) {
                return {
                    success: true,
                    message: `All couriers`,
                    couriers: couriers
                }
            }
            else {
                return {
                    success: false,
                    message: `couriers not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch couriers`
            }
        }
    },
    getAllUsers: async () => {
        try {
            const users = await User.find();
            if (users) {
                return {
                    success: true,
                    message: `All users`,
                    users: users
                }
            }
            else {
                return {
                    success: false,
                    message: `users not found`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch users`
            }
        }
    }
}

module.exports = AdminService;