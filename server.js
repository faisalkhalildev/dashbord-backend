import express from "express";
import { connectDB } from "./utils/db.js";
const app = express();
import user from "./routes/users.routes.js"
import cors from "cors";
import todoRoutes from "./routes/todos.routes.js"

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json())
connectDB()
app.use("/api/user" , user)
app.use("/api/todos", todoRoutes); 



const PORT = 5000;
app.listen(PORT , () =>  console.log(`Server is up on Port ${PORT}`)) ;