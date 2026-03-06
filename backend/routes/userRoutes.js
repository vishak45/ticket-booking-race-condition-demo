import express from "express";
import { rateLimitMiddleware } from "../middleware/rateLimitMiddleware.js";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", rateLimitMiddleware, registerUser);
router.post("/login", rateLimitMiddleware, loginUser);

export default router;