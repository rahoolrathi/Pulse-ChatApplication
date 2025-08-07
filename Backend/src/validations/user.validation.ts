import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional(),
  display_name: Joi.string().min(3).max(50).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).max(100).required(),
}).or('email', 'phone_number')

export const loginSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .optional(),
  password: Joi.string().required(),
}).or('email', 'phone_number');
