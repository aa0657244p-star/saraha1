import { User } from "../../models/User.model.js";
import { Message } from "../../models/Message.model.js";
import { find, findOne, create, updateOne } from "../../database/database.repo.js";
import { SuccessResponse } from "../../common/success.response.js";
import { NotFoundError, UnauthorizedError } from "../../common/errors.response.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await find(User, {}, "fname lname username email role");
    SuccessResponse(res, users, "Users fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, body, parent_id } = req.body;
    const sender_id = req.user._id;

    // Check if receiver exists
    const receiver = await findOne(User, { _id: receiver_id });
    if (!receiver) {
      throw NotFoundError("Receiver not found");
    }

    // Check if sender is admin (optional - from assignment notes)
    // Only admins can send messages (as per the assignment note)
    if (req.user.role !== "admin") {
      throw UnauthorizedError("Only admins can send messages");
    }

    const message = await create(Message, {
      sender_id,
      receiver_id,
      body,
      parent_id: parent_id || null,
      flag: false,
    });

    SuccessResponse(res, message, "Message sent successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getMyMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    })
      .populate("sender_id", "fname lname username")
      .populate("receiver_id", "fname lname username")
      .sort({ createdAt: -1 });

    SuccessResponse(res, messages, "Messages fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const replyMessage = async (req, res, next) => {
  try {
    const { parent_id } = req.params;
    const { body } = req.body;
    const sender_id = req.user._id;

    // Check if parent message exists
    const parentMessage = await findOne(Message, { _id: parent_id });
    if (!parentMessage) {
      throw NotFoundError("Parent message not found");
    }

    // Only admins can reply
    if (req.user.role !== "admin") {
      throw UnauthorizedError("Only admins can reply to messages");
    }

    const message = await create(Message, {
      sender_id,
      receiver_id: parentMessage.sender_id,
      body,
      parent_id,
      flag: false,
    });

    SuccessResponse(res, message, "Reply sent successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { message_id } = req.params;
    const userId = req.user._id;

    const message = await findOne(Message, { _id: message_id });
    if (!message) {
      throw NotFoundError("Message not found");
    }

    // Only sender or admin can delete
    if (message.sender_id.toString() !== userId.toString() && req.user.role !== "admin") {
      throw UnauthorizedError("You are not authorized to delete this message");
    }

    // Soft delete
    await updateOne(Message, { _id: message_id }, { isDeleted: true });

    SuccessResponse(res, null, "Message deleted successfully");
  } catch (err) {
    next(err);
  }
};