//get profile
//get all profiles
//edit profile
//logout
import { User } from "../models/users.models";
import { EditProfileSchema } from "../validations/user.validation";
import { IEditUserAttributes } from "../types/user.types";
import { Op } from "sequelize";

export const getProfile = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const {
    id,
    email,
    phone_number,
    display_name,
    username,
    status_description,
    profile_picture,
  } = user;

  return {
    success: true,
    message: "Profile fetched successfully",
    data: {
      id,
      email,
      phone_number,
      display_name,
      username,
      status_description,
      profile_picture,
    },
  };
};

export const getAllProfiles = async (currentUserId?: string) => {
  const whereCondition = currentUserId
    ? { id: { [Op.ne]: currentUserId } }
    : {};

  const users = await User.findAll({
    where: whereCondition,
    attributes: [
      "id",
      "username",
      "display_name",
      "profile_picture",
      "email",
      "status_description",
      "phone_number",
    ],
  });

  return users;
};

export const editUserProfile = async (
  userId: string,
  input: IEditUserAttributes
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const { error, value } = EditProfileSchema.validate(input);
  if (error) {
    throw new Error(error.details[0].message);
  }
  console.log(value);

  if (value.email) {
    const existingEmail = await User.findOne({
      where: {
        email: value.email,
        id: { [Op.ne]: userId },
      },
    });
    if (existingEmail) {
      throw new Error("Email already exists");
    }
  }

  if (value.phone_number) {
    const existingPhone = await User.findOne({
      where: {
        phone_number: value.phone_number,
        id: { [Op.ne]: userId },
      },
    });
    if (existingPhone) {
      throw new Error("Phone number already exists");
    }
  }

  if (value.username) {
    const existingUsername = await User.findOne({
      where: {
        username: value.username,
        id: { [Op.ne]: userId },
      },
    });
    if (existingUsername) {
      throw new Error("Username already exists");
    }
  }

  await user.update(value);

  return user;
};

export const searchUser = async (key: string) => {
  if (!key) throw new Error("Search key is required");

  return await User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: `%${key}%` } },
        { display_name: { [Op.iLike]: `%${key}%` } },
      ],
    },
    attributes: ["id", "username", "display_name", "profile_picture"],
  });
};
