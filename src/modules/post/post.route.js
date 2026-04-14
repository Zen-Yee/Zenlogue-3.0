import express from "express";
import * as postController from "./post.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireAdmin } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/", postController.allPost);   // show all post
router.get("/:id", postController.specificPost);   // show single post
// router.post("/create", authMiddleware, requireAdmin, postController.createPost);
// router.get("/:id/edit", authMiddleware, requireAdmin, postController.editPostForm);
// router.patch("/:id", authMiddleware, requireAdmin, postController.updatePost);
// router.delete("/:id", authMiddleware, requireAdmin, postController.deletePost);

export default router;