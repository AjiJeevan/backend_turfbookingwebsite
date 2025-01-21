import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/db.js"
import { apiRouter } from "./routes/index.js"

//Connecting to Database
connectDB()

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())
app.use("/api",apiRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})