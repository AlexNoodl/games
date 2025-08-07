import express from "express";
import authRoutes from "./routes/auth.js";
import {config} from "dotenv";
import {connectDB} from "./config/db.js";
import cors from "cors";

config()

await connectDB()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
    origin: process.env.SITE_URL,
    credentials: true
}))
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World2!')
})

app.listen(port, () => {
    console.log(`Server run on port: ${port}`)
})