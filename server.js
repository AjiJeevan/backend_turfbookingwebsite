import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/db.js"
import { apiRouter } from "./routes/index.js"

//Connecting to Database
connectDB()

const app = express()
const port = 3000

app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(cookieParser())
app.use("/api", apiRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})