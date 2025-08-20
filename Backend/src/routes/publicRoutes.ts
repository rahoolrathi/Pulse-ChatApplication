import express from "express";
import authRoutes from "./auth.route";

const router = express.Router();

// Public routes (no authentication required)
router.use("/auth", authRoutes);


export default router;
