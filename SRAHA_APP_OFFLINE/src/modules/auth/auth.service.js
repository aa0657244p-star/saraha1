import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.model.js";
import { findOne, create } from "../../database/database.repo.js";
import { ConflictError, UnauthorizedError } from "../../common/errors.response.js";

export const signup = async (inputs) => {
  // Check if user exists
  const existUser = await findOne(User, { email: inputs.email });
  if (existUser) {
    throw ConflictError("Email already exists");
  }

  const existUsername = await findOne(User, { username: inputs.username });
  if (existUsername) {
    throw ConflictError("Username already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(inputs.password, 10);

  // Create user
  const user = await create(User, {
    fname: inputs.fname,
    lname: inputs.lname,
    username: inputs.username,
    email: inputs.email,
    password: hashedPassword,
    address: inputs.address || "",
    gender: inputs.gender || "male",
    phone: inputs.phone || "",
    age: inputs.age || 18,
    role: inputs.role || "user",
  });

  return user;
};

export const login = async (inputs) => {
  const user = await findOne(User, { email: inputs.email });
  if (!user) {
    throw UnauthorizedError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(inputs.password, user.password);
  if (!isMatch) {
    throw UnauthorizedError("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

export const getProfile = async (userId) => {
  const user = await findOne(User, { _id: userId });
  if (!user) {
    throw NotFoundError("User not found");
  }
  return user;
};

export const updateProfile = async (userId, updates) => {
  const user = await findOne(User, { _id: userId });
  if (!user) {
    throw NotFoundError("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  );
  return updatedUser;
};