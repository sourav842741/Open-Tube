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

app.use(cors({
   origin: "http://localhost:5173",
   credentials: true
}))

// ================= HEALTH CHECK =================
app.get("/api/health", async (req, res) => {

    try {

        // Check MongoDB connection
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

// ================= ROOT =================
app.get("/", (req, res) => {
    res.send("Hello from Server")
})

// ================= START SERVER =================
const startServer = async () => {

    try {

        await connectDb()

        app.listen(port, () => {
            console.log(`✅ Server Started on ${port}`)
        })

    } catch (error) {

        console.log("❌ Database connection failed:", error)

    }

}

startServer()