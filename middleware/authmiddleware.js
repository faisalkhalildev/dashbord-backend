import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }

  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      isSuccess: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;       
    req.userId = decoded.id;   

    next();
  } catch (error) {
    return res.status(403).json({
      isSuccess: false,
      message: "Invalid token",
    });
  }
};
