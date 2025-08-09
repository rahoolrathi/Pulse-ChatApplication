import { Response, NextFunction } from 'express';
import {AuthenticatedRequest} from '../utils/helper.util';
import {verifyToken} from "../services/auth.service"

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  const authResult = await verifyToken(token || '');

  if (!authResult.success) {
    res.status(401).json({ message: authResult.error });
    return;
  }

  req.userId = authResult.userId!;
  next();
};
