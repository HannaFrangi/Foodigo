import express from "express";
import Category from "../models/Category.js";
import Ingredient from "../models/Ingredient.js";
import Recipe from "../models/Recipe.js";
import Area from "../models/Area.js";
import User from "../models/Users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.countDocuments();
    const ingredients = await Ingredient.countDocuments();
    const recipes = await Recipe.countDocuments();
    const areas = await Area.countDocuments();
    const users = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        categories: categories,
        ingredients: ingredients,
        recipes: recipes,
        areas: areas,
        users: users,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
