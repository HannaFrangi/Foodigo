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
  getRecipesByCategory,
  getRecipesByArea,
  getRecipesByAreaName,
  getRecipesByIngredients,
  getRecipesByIngredientsId,
} from "../controllers/recipeControllers.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protectRoute, createRecipe);
router.get("/latest", getLatestRecipe);
router.get("/search", getRecipesByName);
router.get("/category/:categoryId", getRecipesByCategory);
router.get("/random", getRandomRecipe);
router.get("/search_ingredient", getRecipesByIngredients);
router.get("/search_ingredient_id", getRecipesByIngredientsId);
router.get("/:id", getRecipeById);
router.get("/", getAllRecipes);
router.get("/area/:areaId", getRecipesByArea);
router.get("/area/name/:areaName", getRecipesByAreaName);
router.put("/:id", protectRoute, updateRecipe);
router.delete("/:id", protectRoute, deleteRecipe);
router.post("/:id/review", protectRoute, addReview);
router.delete("/:id/review", protectRoute, deleteReview);
router.put("/:id/review", protectRoute, editReview);

export default router;
