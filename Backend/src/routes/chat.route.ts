import ChatController from "../controllers/chat.controller";
import { Router } from "express";
const router = Router();

router.get("/privatemessages/:otherUserId", ChatController.getPrivateMessages);
router.get(
  "/privatechatboxlist",
  ChatController.getPrivateChatBoxListController
);
router.post("/group", ChatController.createGroup);
router.get("/groupchatboxlist", ChatController.getGroupChatBoxListController);

router.get("/groupmessages/:groupId", ChatController.getGroupMessages);
router.post("/directchat", ChatController.createDirectChatController);

export default router;
