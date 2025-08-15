// controllers/chatController.ts
import { Response } from "express";
import { ChatService } from "../services/chat.service";
import { AuthenticatedRequest } from "../utils/helper.util";
export default class ChatController {
  static async getPrivateMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const currentUserId = req.userId;

      if (!currentUserId) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }

      const otherUserId = req.params.otherUserId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 50;

      const result = await ChatService.getPrivateMessages(
        currentUserId,
        otherUserId,
        page,
        limit
      );

      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unexpected error occurred" });
      }
    }
    return;
  }

  static async getPrivateChatBoxListController(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const currentUserId = req.userId;

      if (!currentUserId) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }

      const result = await ChatService.getPrivateChatBoxList(currentUserId);

      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unexpected error occurred" });
      }
    }
    return;
  }

  static async createGroup(req: AuthenticatedRequest, res: Response) {
    try {
      const currentUserId = req.userId;

      if (!currentUserId) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }
      const groupData = {
        ...req.body,
        createdBy: currentUserId,
      };

      const newGroup = await ChatService.createGroup(groupData);

      res.status(201).json(newGroup);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unexpected error occurred" });
      }
    }
    return;
  }
  static async getGroupChatBoxListController(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const currentUserId = req.userId;

      if (!currentUserId) {
        res.status(401).json({ error: "Unauthorized: userId missing" });
        return;
      }

      const result = await ChatService.getUserGroupChatBoxList(currentUserId);

      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unexpected error occurred" });
      }
    }
    return;
  }

  static async getGroupMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const groupId = req.params.groupId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 50;

      const result = await ChatService.getGroupMessages(groupId, page, limit);

      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unexpected error occurred" });
      }
    }
    return;
  }

  static async createDirectChatController(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const currentUserId = req.userId;
      if (!currentUserId) {
        return res.status(401).json({ error: "Unauthorized: userId missing" });
      }

      const { otherUserId } = req.body;
      if (!otherUserId) {
        return res.status(400).json({ error: "Missing otherUserId" });
      }

      const chatData = await ChatService.createDirectChat(
        currentUserId,
        otherUserId
      );

      res.status(201).json(chatData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unexpected error occurred" });
      }
    }
    return;
  }

  


}
