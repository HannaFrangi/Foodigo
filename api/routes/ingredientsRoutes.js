import express from "express";
import { getAllIngredientNames } from "../controllers/IngredientsControllers.js";

const router = express.Router();

router.get("/", getAllIngredientNames);

export default router;
