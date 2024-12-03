import Ingredient from "../models/Ingredient.js";

export const getAllIngredientNames = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    if (ingredients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ingredients found",
      });
    }
    return res.status(200).json({
      success: true,
      data: ingredients,
    });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve ingredients due to server error",
    });
  }
};

export const getIngredientNameByid = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that an ID is provided
    if (!id) {
      return res.status(400).json({
        message: "Ingredient ID is required",
      });
    }

    // Find the ingredient by ID
    const ingredient = await Ingredient.findById(id).select("name");

    // Check if ingredient exists
    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    // Return the ingredient name
    res.status(200).json({
      name: ingredient.name,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error retrieving ingredient:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
