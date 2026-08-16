import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User: /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true, //Prevent JS to access Cookie
            secure: process.env.NODE_ENV == 'production', //True -> Only send in HTTPS
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict', //CSRF Projection
            maxAge: 7 * 24 * 60 * 60 * 1000 //Cookie expiration time
        })

        return res.json({ success: true, user: { _id: user._id, email: user.email, name: user.name } });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login User: /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.json({ success: false, message: 'Email and Password are required' });
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' })
        }

        const isMached = await bcrypt.compare(password, user.password)

        if (!isMached) {
            return res.json({ success: false, message: 'Invalid email or password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({ success: true, user: { _id: user._id, email: user.email, name: user.name } })


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Check Auth: /api/user/is-auth

export const isAuth = async (req, res) => {
    try {
        const userId = req.body?.userId || req.userId;
        const user = await User.findById(userId).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout User: /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logout Successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}