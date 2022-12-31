import express from "express";
import { getUser, getUserFriends, addRemoveFriend } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); // Get user by id
router.get("/:id/friends", verifyToken, getUserFriends); // Get user friends by id

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); // Add or remove friend

export default router;