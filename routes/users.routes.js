import express from "express";
const router = express.Router();

import { loginUser, registeredUser, getUser } from "../controllers/users.contoller.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

router.post("/register" , registeredUser);
router.get("/getUser" ,authMiddleware, getUser)
router.post("/login" , loginUser)

export default router