import User from "../models/User.js";

// Update User Cart: /api/cart/update
export const updateCart = async (req, res) => {
    try {
        // userId is injected by authUser middleware
        const userId = req.userId || req.body?.userId;
        const { cartItems } = req.body;
        await User.findByIdAndUpdate(userId, { cartItems });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};