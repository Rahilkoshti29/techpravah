import express from "express"

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js"

import { protect } from "../middleware/authMiddleware.js"
import { authorize } from "../middleware/roleMiddleware.js"

const router = express.Router()

// Get all categories => Public
router.get("/", getCategories)
// Create category => Admin only
router.post("/", protect, authorize("admin"), createCategory)
// Update category => Admin only
router.put("/:id", protect, authorize("admin"), updateCategory)
// Delete category => Admin only
router.delete("/:id", protect, authorize("admin"), deleteCategory)

export default router