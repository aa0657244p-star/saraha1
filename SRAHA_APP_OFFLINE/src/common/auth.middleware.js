import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { UnauthorizedError } from "./errors.response.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw UnauthorizedError("Only admins can send messages");
    }
    next();
  } catch (err) {
    next(err);
  }
};