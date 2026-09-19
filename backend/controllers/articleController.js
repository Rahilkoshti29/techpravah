import Article from "../models/Article.js"
import Category from "../models/Category.js"

// CREATE ARTICLE => POST /api/articles
const createArticle = async (req, res) => {
  try {
    const {
      title, slug,
      content,
      summary,
      coverImage,
      category,
      tags,
      status
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({
        message: "Title, slug and content are required"
      });
    }

    // Check slug uniqueness
    const existingArticle = await Article.findOne({
      slug: slug.toLowerCase()
    });

    if (existingArticle) {
      return res.status(400).json({
        message: "Slug already exists, choose a different one"
      });
    }

    // Check category
    if (category) {
      const categoryData = await Category.findById(category);

      if (!categoryData) {
        return res.status(404).json({
          message: "Category not found"
        });
      }
    }

    // Create article
    const article = await Article.create({
      title,
      slug: slug.toLowerCase(),
      content,
      summary,
      coverImage,
      category: category || null,
      author: req.user._id,
      tags: tags || [],
      status: status || "draft",
      publishedAt: status === "published" ? new Date() : null
    });

    // Populate references
    const populatedArticle = await Article.findById(article._id)
      .populate("author", "name email role")
      .populate("category", "name slug");

    res.status(201).json({
      message: "Article created successfully",
      article: populatedArticle
    });

  } catch (error) {
    console.error("Create Article Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// GET ALL ARTICLES + SEARCH + FILTER => GET /api/articles

const getArticles = async (req, res) => {
  try {
    const {
      category,
      status,
      author,
      search,
      page,
      limit
    } = req.query;

    const filter = {};

    // Public listing only shows published unless caller asked otherwise
    filter.status = status || "published";

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by author
    if (author) {
      filter.author = author;
    }

    // Search by title or summary
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          summary: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const articles = await Article.find(filter)
      .populate("author", "name email role")
      .populate("category", "name slug")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Article.countDocuments(filter);

    res.status(200).json({
      count: articles.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      articles
    });

  } catch (error) {
    console.error("Get Articles Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// GET MY ARTICLES (author's own, any status) => GET /api/articles/mine

const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      author: req.user._id
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: articles.length,
      articles
    });

  } catch (error) {
    console.error("Get My Articles Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// GET SINGLE ARTICLE => GET /api/articles/:slug

const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug
    })
      .populate("author", "name email role")
      .populate("category", "name slug");

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    article.views += 1;
    await article.save();

    res.status(200).json({
      article
    });

  } catch (error) {
    console.error("Get Article Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// UPDATE ARTICLE => PUT /api/articles/:id

const updateArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      summary,
      coverImage,
      category,
      tags,
      status
    } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    // Only the article's own author OR an admin can update
    const isOwner = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to update this article"
      });
    }

    // Update only provided fields
    if (title !== undefined) {
      article.title = title;
    }

    if (content !== undefined) {
      article.content = content;
    }

    if (summary !== undefined) {
      article.summary = summary;
    }

    if (coverImage !== undefined) {
      article.coverImage = coverImage;
    }

    if (category !== undefined) {
      article.category = category;
    }

    if (tags !== undefined) {
      article.tags = tags;
    }

    if (status !== undefined && status !== article.status) {
      article.status = status;

      if (status === "published") {
        article.publishedAt = new Date();
      }
    }

    const updatedArticle = await article.save();

    const populatedArticle = await Article.findById(updatedArticle._id)
      .populate("author", "name email role")
      .populate("category", "name slug");

    res.status(200).json({
      message: "Article updated successfully",
      article: populatedArticle
    });

  } catch (error) {
    console.error("Update Article Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// DELETE ARTICLE => DELETE /api/articles/:id

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    const isOwner = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this article"
      });
    }

    await article.deleteOne();

    res.status(200).json({
      message: "Article deleted successfully"
    });

  } catch (error) {
    console.error("Delete Article Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export {
  createArticle,
  getArticles,
  getMyArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle
}