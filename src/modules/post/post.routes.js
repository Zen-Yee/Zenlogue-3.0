import express from "express";
import * as postController from "./post.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
// import { requireAdmin } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/", postController.allPost);   // show all post
router.get("/:id", postController.onePost);   // show single post
router.post("/create", authMiddleware, postController.createPost);
// router.patch("/:id", authMiddleware, postController.updatePost);
// router.delete("/:id", authMiddleware, postController.deletePost);

export default router;