import express from "express";
import authRoutes from "./routes/auth.js";
import {config} from "dotenv";
import {connectDB} from "./config/db.js";
import cors from "cors";
import {setupSwagger} from "./swagger.js";


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

setupSwagger(app)

app.listen(port, () => {
    console.log(`Server run on port: ${port}`)
    console.log(`Swagger docs available at ${process.env.BACKEND_URL}/api-docs`)
})