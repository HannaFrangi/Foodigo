import express from "express";
import {
  createIngredient,
  getAllIngredients,
  getIngredientNamesByIds,
} from "../controllers/ingredientsControllers.js";
import { cacheMiddleware } from "../config/cache.js";

const router = express.Router();

router.post("/create", createIngredient);
router.post("/names", getIngredientNamesByIds);
router.get("/", cacheMiddleware(1800), getAllIngredients);

export default router;
