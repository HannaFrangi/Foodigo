import express from "express";
import {
  createIngredient,
  getAllIngredients,
  getIngredientNamesByIds,
} from "../controllers/ingredientsControllers.js";

const router = express.Router();

router.post("/create", createIngredient);
router.post("/names", getIngredientNamesByIds);
router.get("/", getAllIngredients);

export default router;
