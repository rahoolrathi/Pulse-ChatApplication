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
  identifier: Joi.string().required().label('Email, Phone Number, or Username'),
  password: Joi.string().required(),
});

export const EditProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone_number: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional(),
  status_description: Joi.string().max(255).optional(),
  profile_picture: Joi.string().optional(),
});