import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../utils/helper.util';
import {JwtPayload} from "../types/jwt-payload.types"
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, JWT_CONFIG.JWT_SECRET, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !('userId' in decoded)) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    const payload = decoded as JwtPayload;
    req.userId = payload.userId;
    next();
  });
};
