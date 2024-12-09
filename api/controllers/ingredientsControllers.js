import Ingredient from "../models/Ingredient.js";
import mongoose from "mongoose";

export const createIngredient = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Ingredient name is required",
      });
    }

    const existingIngredient = await Ingredient.findOne({ name });
    if (existingIngredient) {
      return res.status(409).json({
        success: false,
        message: "Ingredient already exists",
      });
    }

    const newIngredient = new Ingredient({ name });
    await newIngredient.save();

    res.status(201).json({
      success: true,
      data: newIngredient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating ingredient",
      error: error.message,
    });
  }
};

export const getIngredientNamesByIds = async (req, res) => {
  try {
    const { ingredientIds } = req.body;

    // Validate input
    if (
      !ingredientIds ||
      !Array.isArray(ingredientIds) ||
      ingredientIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Ingredient IDs are required",
      });
    }

    // Validate ObjectIds
    const validIds = ingredientIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid ingredient IDs",
      });
    }

    // Convert to ObjectIds
    const objectIds = validIds.map((id) => new mongoose.Types.ObjectId(id));

    // Find ingredients
    const ingredients = await Ingredient.find({
      _id: { $in: objectIds },
    }).select("_id name");

    // Check if ingredients were found
    if (ingredients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ingredients found",
      });
    }

    res.status(200).json({
      success: true,
      data: ingredients,
    });
  } catch (error) {
    console.error("Error retrieving ingredient names:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().select("_id name");

    res.status(200).json({
      success: true,
      data: ingredients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ingredients",
      error: error.message,
    });
  }
};
