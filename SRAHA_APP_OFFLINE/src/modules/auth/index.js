import express from "express";
import { signupController, loginController, getProfileController, updateProfileController } from "./auth.controller.js";
import { authMiddleware } from "../../common/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/profile", authMiddleware, getProfileController);
router.put("/profile", authMiddleware, updateProfileController);

export default router;