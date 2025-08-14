import { socketAuthMiddleware } from "../middleware/socket.middleware";
import { AuthenticatedSocket, RoomType } from "../utils/helper.util";
import { Server } from "socket.io";
import { ChatService } from "../services/chat.service";
import { RequestMessageData } from "../types/chat.types";
import { redisClient } from "../utils/redis.util";
export class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.initializeMiddleware();
    this.initializeEventHandlers();
  }

  private initializeMiddleware(): void {
    this.io.use(socketAuthMiddleware);
  }

  private initializeEventHandlers(): void {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.userId} connected`);

      socket.join(`user_${socket.userId}`);

      this.joinUserToGroups(socket);

      // Handle private messages
      socket.on("send_private_message", async (data: RequestMessageData) => {
        console.log(data);
        await this.handlePrivateMessage(socket, data);
      });

      socket.on("send_group_message", async (data: RequestMessageData) => {
        await this.handleGroupMessage(socket, data);
      });

      // Handle disconnect
      socket.on("disconnect", async () => {
        await this.handleDisconnect(socket);
      });
    });
  }

  private async joinUserToGroups(socket: AuthenticatedSocket): Promise<void> {
    try {
      const userGroups = await ChatService.getUserGroups(socket.userId!);

      userGroups.forEach((membership) => {
        socket.join(`group_${membership.groupId}`);
      });

      console.log(`User ${socket.userId} joined ${userGroups.length} groups`);
    } catch (error) {
      console.error("Error joining user groups:", error);
    }
  }

  private async handlePrivateMessage(
    socket: AuthenticatedSocket,
    data: RequestMessageData
  ): Promise<void> {
    try {
      const messageResponse = await ChatService.saveMessage({
        ...data,
        senderId: socket.userId!,
        roomtype: RoomType.PRIVATE,
      });

      socket.emit("message_sent", messageResponse);

      socket
        .to(`user_${data.otherId}`)
        .emit("private_message_received", messageResponse);

      console.log(
        `Private message sent from ${socket.userId} to ${data.otherId}`
      );
    } catch (error) {
      console.error("Error handling private message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  private async handleGroupMessage(
    socket: AuthenticatedSocket,
    data: RequestMessageData
  ): Promise<void> {
    try {
      const messageResponse = await ChatService.saveMessage({
        ...data,
        senderId: socket.userId!,
        roomtype: RoomType.GROUP,
      });

      this.io
        .to(`group_${data.otherId}`)
        .emit("group_message_received", messageResponse);

      console.log(
        `Group message sent by ${socket.userId} to group ${data.otherId}`
      );
    } catch (error) {
      console.error("Error handling group message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  }

  private async handleDisconnect(socket: AuthenticatedSocket): Promise<void> {
    try {
      if (socket.userId) {
        await redisClient.del(`user_socket:${socket.userId}`);
        console.log(`User ${socket.userId} disconnected`);
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }
}
