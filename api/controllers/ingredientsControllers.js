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
