import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // Get feed posts
router.get("/:userId/posts", verifyToken, getUserPosts); // Get user posts by User ID

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost); // Like post

export default router;