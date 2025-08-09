import {AuthenticatedSocket} from '../utils/helper.util';
import {verifyToken} from "../services/auth.service"
import { redisClient } from '../utils/redis.util';
export const socketAuthMiddleware = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): Promise<void> => {
  
 const token =
  socket.handshake.auth?.token ||
  socket.handshake.query?.token ||
  socket.handshake.headers?.authorization?.split(' ')[1];


  const authResult = await verifyToken(token);

  if (!authResult.success) {
    return next(new Error(authResult.error));
  }

  socket.userId = authResult.userId!;
  
  const SOCKET_TTL_SECONDS = 86400;

  await redisClient.setex(`user_socket:${authResult.userId}`, SOCKET_TTL_SECONDS, socket.id);
  
  next();
};