import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.userId || req.body?.userId;
        await Address.create({ ...address, userId });
        res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Export alias for backward compatibility
export const addAddresss = addAddress;

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId || req.query?.userId;
        const addresses = await Address.find({ userId });
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};
