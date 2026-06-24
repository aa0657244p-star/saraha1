import { signup, login, getProfile, updateProfile } from "./auth.service.js";
import { SuccessResponse } from "../../common/success.response.js";
import { GlobalError } from "../../common/errors.response.js";

export const signupController = async (req, res, next) => {
  try {
    const user = await signup(req.body);
    SuccessResponse(res, user, "User created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);
    SuccessResponse(res, result, "Login successful", 200);
  } catch (err) {
    next(err);
  }
};

export const getProfileController = async (req, res, next) => {
  try {
    const user = await getProfile(req.user.id);
    SuccessResponse(res, user, "Profile fetched successfully", 200);
  } catch (err) {
    next(err);
  }
};

export const updateProfileController = async (req, res, next) => {
  try {
    const user = await updateProfile(req.user.id, req.body);
    SuccessResponse(res, user, "Profile updated successfully", 200);
  } catch (err) {
    next(err);
  }
};