import { Request, Response } from 'express';
import { signupUser,loginUser } from '../services/auth.service';

export const signupController = async (req: Request, res: Response) => {
  try {
    const newUser = await signupUser(req.body);
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        display_name: newUser.display_name,
        username: newUser.username,
        email: newUser.email,
        phone_number: newUser.phone_number,
        is_verified: newUser.is_verified,
      },
    });
  } catch (error) {
   if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  }
};


export const loginController = async (req: Request, res: Response) => {
  try {
   
    const { identifier, password } = req.body;
     

    const result = await loginUser({ identifier, password });
console.log(identifier)
    res.status(200).json({
      message: 'Login successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          phone_number: result.user.phone_number,
          username: result.user.username,
          display_name: result.user.display_name,
          is_verified: result.user.is_verified,
        },
        token: result.token,
      },
    });
  } catch (error) {
   if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  }
};