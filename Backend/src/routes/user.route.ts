// user.routes.ts
import { Router } from "express";
import * as UserController from "../controllers/user.contoller";
import { upload } from "../utils/multer";
const router = Router();

router.get("/profile", UserController.getProfile);
router.get("/allprofile", UserController.getAllProfiles);
router.put(
  "/edit",

  upload.single("profile_picture"),
  UserController.editProfile
);
router.get("/search", UserController.searchUserHandler);
export default router;

// TODO:public and private routes seperation required
