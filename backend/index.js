import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDb.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './route/authRoute.js'
import userRouter from './route/userRoute.js'
import contentRouter from './route/contentRoute.js'

dotenv.config()
const port = process.env.PORT


const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
   origin:"https://open-tube-1.onrender.com",
   credentials:true
}))



app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/content",contentRouter)

app.get("/" , (req,res)=>{
    res.send("Hello from Server")
})

app.listen(port , ()=>{
    console.log("Server Started")
    connectDb()
})
