import express from "express"

import {
  addComment,
  getArticleComments,
  updateComment,
  deleteComment
} from "../controllers/commentController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Add comment
router.post("/", protect, addComment)

// Get all comments of an article
router.get("/article/:articleId", getArticleComments)

// Update comment
router.put("/:id", protect, updateComment)

// Delete comment
router.delete("/:id", protect, deleteComment)

export default router