import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG ,AuthenticatedRequest} from '../utils/helper.util';
import {JwtPayload} from "../types/jwt-payload.types"

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
console.log(token)
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, JWT_CONFIG.JWT_SECRET, (err, decoded) => {
    console.log(decoded)
    if (err || typeof decoded !== 'object' || !('id' in decoded)) {
      res.status(403).json({ message: 'Invalid token' });
      return;
    }

    const payload = decoded as JwtPayload;
    req.userId = Number(payload.id) as number;

    next();
  });
};
