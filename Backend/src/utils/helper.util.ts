import bcrypt from 'bcrypt';
import { JwtEnvConfig } from '../types/env.types';
import jwt from 'jsonwebtoken';
import { Dialect } from 'sequelize';
import { DatabaseConfig } from '../types/env.types';

export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
export const JWT_CONFIG: JwtEnvConfig = {
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN'),
  BCRYPT_SALT: getEnvVar('BCRYPT_SALT'),
};

export const DB_CONFIG: DatabaseConfig = {
  DB_NAME: getEnvVar('DB_NAME'),
  DB_USER: getEnvVar('DB_USER'),
  DB_PASS: getEnvVar('DB_PASS'),
  DB_HOST: getEnvVar('DB_HOST'),
  DB_DIALECT: getEnvVar('DB_DIALECT') as Dialect,
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};

export const getInputType = (input: string): 'email' | 'phone_number' => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{10,15}$/;

  if (emailRegex.test(input)) return 'email';
  if (phoneRegex.test(input)) return 'phone_number';
  throw new Error('Invalid input: must be a valid email or phone number');
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_CONFIG.JWT_SECRET, { expiresIn: '7d' });}








