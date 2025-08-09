// user.routes.ts
import { Router } from 'express';
import * as UserController from '../controllers/user.contoller';
import { authMiddleware } from '../middleware/http.middleware';
import { upload } from '../utils/multer';
const router = Router();

router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/edit', authMiddleware,upload.single('profile_picture'), UserController.editProfile);

export default router;
