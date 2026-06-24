import express from "express";
import {
  getAllUsers,
  sendMessage,
  getMyMessages,
  replyMessage,
  deleteMessage,
} from "./user.controller.js";
import { authMiddleware, adminMiddleware } from "../../common/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.post("/message", authMiddleware, adminMiddleware, sendMessage);
router.get("/messages", authMiddleware, getMyMessages);
router.post("/message/:parent_id/reply", authMiddleware, adminMiddleware, replyMessage);
router.delete("/message/:message_id", authMiddleware, deleteMessage);

export default router;