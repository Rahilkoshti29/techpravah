import Comment from "../models/Comment.js"
import Article from "../models/Article.js"

// ADD COMMENT => POST /api/comments
const addComment = async (req, res) => {
  try {
    const { article, comment } = req.body

    if (!article || !comment) {
      return res.status(400).json({
        message: "Article and comment are required"
      })
    }

    // Find article
    const articleData = await Article.findById(article)

    if (!articleData) {
      return res.status(404).json({
        message: "Article not found"
      })
    }

    // Create comment
    const newComment = await Comment.create({
      article: articleData._id,
      user: req.user._id,
      comment
    })

    // Populate user details
    const populatedComment = await Comment.findById(
      newComment._id
    ).populate("user", "name email role")

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment
    })
  } catch (error) {
    console.error("Add Comment Error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

// GET COMMENTS FOR AN ARTICLE => GET /api/comments/article/:articleId
const getArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params

    const article = await Article.findById(articleId)

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      })
    }

    const comments = await Comment.find({
      article: articleId
    })
      .populate("user", "name email role")
      .sort({ createdAt: 1 })

    res.status(200).json({
      count: comments.length,
      comments
    })
  } catch (error) {
    console.error("Get Comments Error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

// UPDATE COMMENT => PUT /api/comments/:id
const updateComment = async (req, res) => {
  try {
    const { comment } = req.body

    if (!comment) {
      return res.status(400).json({
        message: "Comment is required"
      })
    }

    const existingComment = await Comment.findById(
      req.params.id
    )

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found"
      })
    }

    // Only comment owner can edit
    if (
      existingComment.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only edit your own comments"
      })
    }

    existingComment.comment = comment

    await existingComment.save()

    const updatedComment = await Comment.findById(
      existingComment._id
    ).populate("user", "name email role")

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment
    })
  } catch (error) {
    console.error("Update Comment Error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

// DELETE COMMENT => DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const existingComment = await Comment.findById(
      req.params.id
    )

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found"
      })
    }

    const isOwner =
      existingComment.user.toString() ===
      req.user._id.toString()

    const isAdmin = req.user.role === "admin"

    // Comment owner OR admin can delete
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can only delete your own comments"
      })
    }

    await existingComment.deleteOne()

    res.status(200).json({
      message: "Comment deleted successfully"
    })
  } catch (error) {
    console.error("Delete Comment Error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

export {
  addComment,
  getArticleComments,
  updateComment,
  deleteComment
}