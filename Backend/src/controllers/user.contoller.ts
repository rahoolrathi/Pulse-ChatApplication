import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { AuthenticatedRequest } from "../utils/helper.util";
import { ParsedQs } from "qs";
const path = require("path");
interface SearchUserQuery extends ParsedQs {
  key: string;
}
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: userId missing" });
      return;
    }

    const user = await userService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unexpected error occurred" });
    }
    return;
  }
};

export const editProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: userId missing" });
      return;
    }

    const input = {
      ...req.body,
      profile_picture: req.file
        ? path.join(`/uploads/${req.file.filename}`)
        : undefined,
    };
    console.log(input.profile_picture);
    const updatedUser = await userService.editUserProfile(userId, input);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unexpected error occurred" });
    }
    return;
  }
};

export const searchUserHandler = async (
  req: Request<{}, {}, {}, SearchUserQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ message: "Search key is required" });
    }
    const users = await userService.searchUser(key);
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
  return;
};
