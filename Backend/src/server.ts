import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import sequelize from './config/database';
import { redisClient } from './utils/redis.util';
import { SocketManager } from './sockets/socket';
import { Server } from 'socket.io';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  },
  transports: ['websocket', 'polling']
});

new SocketManager(io);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    await redisClient.connect();
    console.log('✅ Redis connected successfully');

    const PORT = parseInt(process.env.PORT || '4000');
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📡 Socket.IO server ready`);
    });
  } catch (error) {
    console.error('❌ Startup error:', error);
    process.exit(1);
  }
})();
