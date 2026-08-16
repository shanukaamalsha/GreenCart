import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Allowed Origins (add your deployed frontend URLs here)
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middleware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => res.send("API IS WORKING"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;