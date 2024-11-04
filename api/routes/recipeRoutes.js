import express from "express";
import {
  createRecipe,
  getRecipeById,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  addReview,
  deleteReview,
  editReview,
  getLatestRecipe,
  getRandomRecipe,
  getRecipesByName,
} from "../controllers/recipeControllers.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protectRoute, createRecipe); // Create a recipe
router.get("/latest", getLatestRecipe); // Get the latest recipes
router.get("/search", getRecipesByName);
router.get("/random", getRandomRecipe); // Get a random recipe
router.get("/:id", getRecipeById); // Get a single recipe by ID
router.get("/", getAllRecipes); // Get all recipes
router.put("/:id", protectRoute, updateRecipe); // Update a recipe by ID
router.delete("/:id", protectRoute, deleteRecipe); // Delete a recipe by ID
router.post("/:id/review", protectRoute, addReview); // Add a review to a recipe
router.delete("/:id/review", protectRoute, deleteReview); // Delete a review from a recipe
router.put("/:id/review", protectRoute, editReview); // Edit a review for a recipe

export default router;
