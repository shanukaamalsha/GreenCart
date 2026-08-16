import mongoose from "mongoose";

// Cache the connection for serverless (Vercel) environments
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/greencart`)
            .then((m) => {
                console.log("MongoDB connected");
                return m;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("MongoDB connection error:", error.message);
    }
    return cached.conn;
}

export default connectDB;