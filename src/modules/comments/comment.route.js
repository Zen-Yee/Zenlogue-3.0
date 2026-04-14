import express from "express";
import * as commentController from "./comment.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", authController.signupSubmit);
router.post("/login", authController.loginSubmit);
router.post("/logout", authMiddleware, authController.logout);

export default router;
