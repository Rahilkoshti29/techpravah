import express from "express"
import {
  createArticle,
  getArticles,
  getMyArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle
} from "../controllers/articleController.js"

import { protect } from "../middleware/authMiddleware.js"
import { authorize } from "../middleware/roleMiddleware.js"

const router = express.Router()

// CREATE ARTICLE => Author or Admin only => POST /api/articles
router.post("/", protect, authorize("author", "admin"), createArticle)

// GET ALL ARTICLES + SEARCH + FILTER => Public => GET /api/articles
router.get("/", getArticles)

// GET MY OWN ARTICLES => Author or Admin => GET /api/articles/mine
router.get("/mine", protect, authorize("author", "admin"), getMyArticles)

// GET SINGLE ARTICLE => Public => GET /api/articles/:slug
router.get("/:slug", getArticleBySlug)

// UPDATE ARTICLE => Owner author or Admin (checked inside controller) => PUT /api/articles/:id
router.put("/:id", protect, authorize("author", "admin"), updateArticle)

// DELETE ARTICLE => Owner author or Admin (checked inside controller) => DELETE /api/articles/:id
router.delete("/:id", protect, authorize("author", "admin"), deleteArticle)

export default router