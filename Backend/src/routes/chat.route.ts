import ChatController from "../controllers/chat.controller"
import { Router } from 'express';
import { authMiddleware } from '../middleware/http.middleware';
const router = Router();

router.get(
  '/privatemessages/:otherUserId',
  authMiddleware,
  ChatController.getPrivateMessages
);
router.get(
  '/privatechatboxlist',
  authMiddleware,
  ChatController.getPrivateChatBoxListController);
router.post('/group', authMiddleware, ChatController.createGroup);
router.get(
  '/groupchatboxlist',
  authMiddleware,
  ChatController.getGroupChatBoxListController);
 
router.get(
  '/groupmessages/:groupId',
  authMiddleware,
  ChatController.getGroupMessages
);

export default router;

