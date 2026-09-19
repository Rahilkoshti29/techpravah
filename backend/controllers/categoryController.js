import Category from "../models/Category.js"

// CREATE CATEGORY => POST /api/categories

const createCategory = async (req, res) => {
  try {

    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Category name and slug are required"
      });
    }

    const existingCategory = await Category.findOne({
      slug: slug.toLowerCase()
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category slug already exists"
      });
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase(),
      description
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// GET ALL CATEGORIES => GET /api/categories

const getCategories = async (req, res) => {
  try {

    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      count: categories.length,
      categories
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// UPDATE CATEGORY => PUT /api/categories/:id

const updateCategory = async (req, res) => {
  try {

    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    if (name !== undefined) {
      category.name = name;
    }

    if (description !== undefined) {
      category.description = description;
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// DELETE CATEGORY => DELETE /api/categories/:id

const deleteCategory = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};