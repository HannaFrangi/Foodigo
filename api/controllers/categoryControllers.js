import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
        data: existingCategory,
      });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error in addCategory:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
