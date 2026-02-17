import express from "express";
import { connectDB } from "./utils/db.js";
const app = express();
import user from "./routes/users.routes.js"
import cors from "cors";
import todoRoutes from "./routes/todos.routes.js"
import { uploadRouter } from "./routes/upload.js";
app.use(cors({
  origin: "*",
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use(express.json())
connectDB()
app.use("/api/user" , user)
app.use("/api/todos", todoRoutes);
app.use("/api/upload" ,uploadRouter ) 



const PORT = process.env.PORT || 5000;
app.listen(PORT , () =>  console.log(`Server is up on Port ${PORT}`)) ;