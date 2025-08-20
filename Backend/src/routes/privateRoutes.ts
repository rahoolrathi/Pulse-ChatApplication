import express from "express";
import userRoutes from "./user.route";
import chatRoutes from "./chat.route";
import { authMiddleware } from "../middleware/http.middleware";

const router = express.Router();

router.use(authMiddleware);


router.use("/profile", userRoutes);
router.use("/chats", chatRoutes);



export default router;
