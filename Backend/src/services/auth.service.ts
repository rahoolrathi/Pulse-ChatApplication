import { User } from "../models/users.models";
import { signupSchema, loginSchema } from "../validations/user.validation";
import {
  getInputType,
  hashPassword,
  comparePassword,
  JWT_CONFIG,
} from "../utils/helper.util";
import { IUserAttributes } from "../types/user.types";
import { generateToken } from "../utils/helper.util";
import { ILoginInput } from "../types/user.types";
import { AuthResult } from "../types/auth-result.types";
import { JwtPayload } from "../types/jwt-payload.types";
import jwt from "jsonwebtoken";
export const signupUser = async (input: Partial<IUserAttributes>) => {
  const { error, value } = signupSchema.validate(input); //todo:valdiions in controller
  if (error) throw new Error(`Validation error: ${error.details[0].message}`);

  const inputKey = getInputType(value.email || value.phone_number!);
  const inputValue = value[inputKey];

  const existingUser = await User.findOne({
    where: { [inputKey]: inputValue },
  });
  if (existingUser) {
    throw new Error(`${inputKey} already in use.`);
  }
  const existingUserByUsername = await User.findOne({
    where: { username: value.username },
  });
  if (existingUserByUsername) {
    throw new Error(`Username "${value.username}" is already taken.`);
  }

  const hashedPassword = await hashPassword(value.password);

  const newUser = await User.create({
    ...value,
    password: hashedPassword,
  });

  return newUser;
};
export const loginUser = async (input: ILoginInput) => {
  const { error, value } = loginSchema.validate(input);

  if (error) throw new Error(`Validation error: ${error.details[0].message}`);

  const { identifier, password } = value;
  console.log(identifier, password);
  let user;
  const inputType = getInputType(identifier);

  user = await User.findOne({ where: { [inputType]: identifier } });

  if (!user) {
    user = await User.findOne({ where: { username: identifier } });
  }

  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  const token = generateToken({ id: user.id });

  return { id: user.id, token };
};

export const verifyToken = async (token: string): Promise<AuthResult> => {
  try {
    if (!token) {
      return { success: false, error: "No token provided" };
    }

    const decoded = jwt.verify(token, JWT_CONFIG.JWT_SECRET) as JwtPayload;

    if (!decoded || typeof decoded !== "object") {
      return { success: false, error: "Invalid token format" };
    }

    if (!decoded.id) {
      return { success: false, error: "Missing user ID in token" };
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, userId: decoded.id };
  } catch (error) {
    console.error("Token verification error:", error);
    return { success: false, error: "Token verification failed" };
  }
};
