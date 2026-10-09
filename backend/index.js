import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import connectDb from './config/connectDb.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './route/authRoute.js'
import userRouter from './route/userRoute.js'
import contentRouter from './route/contentRoute.js'

dotenv.config()

const port = process.env.PORT || 5000

const app = express()

// ================= MIDDLEWARE =================
app.use(cookieParser())

app.use(express.json())

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://open-tube-1.onrender.com",
  "https://open-tube.onrender.com",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith(".onrender.com") ||
      /^http:\/\/localhost:\d+$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error(`CORS error: ${origin} not allowed`));
  },
  credentials: true
}))

// ================= HEALTH CHECK =================
app.get("/api/health", async (req, res) => {

    try {

        // MongoDB connection check
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB not connected")
        }

        const db = mongoose.connection.db

        if (!db) {
            throw new Error("Database unavailable")
        }

        // Ping MongoDB
        await db.admin().ping()

        res.status(200).json({
            status: "ok",
            db: "connected",
            timestamp: new Date().toISOString()
        })

    } catch (error) {

        res.status(500).json({
            status: "error",
            db: "disconnected",
            error: error.message
        })

    }

})

// ================= ROUTES =================
app.use("/api/auth", authRouter)

app.use("/api/user", userRouter)

app.use("/api/content", contentRouter)

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
    res.send("Hello from Server")
})

// ================= START SERVER =================
const startServer = async () => {

    try {

        // First connect DB
        await connectDb()

        // Then start server
        app.listen(port, () => {
            console.log(`✅ Server Started on Port ${port}`)
        })

    } catch (error) {

        console.log("❌ Database connection failed:", error)

    }

}

// Run server
startServer()