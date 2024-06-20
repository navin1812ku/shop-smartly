const User = require('../../models/user/User');

const AddressService = {
    addAddress: async (userId, address) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                if (address.isDefault) {
                    user.address.map((address) => {
                        address.isDefault = false
                    })
                    await user.save();
                }
                user.address.push(address);
                await user.save();
                return {
                    success: true,
                    message: `Address added `,
                    user: user
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to add address`
            }
        }
    },
    getAddresses: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                return {
                    success: true,
                    message: `Address fetched successfully`,
                    userId: userId,
                    address: user.address
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to fetch address`
            }
        }
    },
    updateAddress: async (userId, addressId, address) => {
        try {
            console.log(addressId, address);
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                user.address.find(address => address._id == addressId).set(address);
                await user.save();
                return {
                    success: true,
                    message: `Address updated successfully`,
                    userId: userId,
                    address: user.address
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to update address`
            }
        }
    },
    setDefaultAddress: async (userId, setDefaultAddressDetails) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                user.address.id(setDefaultAddressDetails.id).set({ isDefault: setDefaultAddressDetails.isDefault });
                await user.save();

                user.address.map((address) => {
                    if (String(address._id) !== String(setDefaultAddressDetails.id)) {
                        address.isDefault = false
                    }
                })
                await user.save();
                return {
                    success: true,
                    message: `Address set to default`
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to set address default`,
                error: error
            }
        }
    },
    deleteAddress: async (userId, addressId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: `User not found`
                }
            }
            else {
                const isDefault = user.address.id(addressId).isDefault;
                user.address.id(addressId).deleteOne();
                await user.save();
                console.log(user.address);
                if (isDefault) {
                    user.address[0].set({ isDefault: true });
                    await user.save();
                }
                return {
                    success: true,
                    message: `Address deleted from DB`,
                    address: user.address
                }
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to delete address`
            }
        }
    }
};

module.exports = AddressService;