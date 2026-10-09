import { Server } from "socket.io"
import http from "http"
import express from "express"
const app = express()
const server = http.createServer(app)

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://open-tube-1.onrender.com",
    "https://open-tube.onrender.com"
];

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".onrender.com") || /^http:\/\/localhost:\d+$/.test(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
})

const userSocketMap = {}

io.on("connection" , (socket)=>{
    
    const userId=socket.handshake.query.userId
    if(userId!=undefined){
        userSocketMap[userId] = socket.id
    }

    

    socket.on('disconnect',()=>{
        delete userSocketMap[userId]
    })
})

export {app,io, server}