import mongoose from "mongoose";
import {config} from "dotenv";

config()

const mongoUri = process.env.MONGO_URI
const mongoPassword = process.env.MONGO_PASSWORD
const mongoUser = process.env.MONGO_USER

const uri = 'mongodb://' + mongoUser + ':' + encodeURIComponent(mongoPassword) + '@' + mongoUri

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(uri)

        console.log('MongoDB Connected', connection.connection.name)
    } catch (error) {
        console.log('Mongo DB connection failed:', error.message)
        process.exit()
    }
}