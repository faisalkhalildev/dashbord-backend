import mongoose from "mongoose";
import { configDotenv } from 'dotenv'
configDotenv()
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI)

        console.log(`Connected to DB ${conn.connection.host}`);
        
    } catch (error) {
        console.log("Error in connection", error.message);
        
    }
}
