import express from "express";
import {
  getAllIngredientNames,
  getIngredientNameByid,
} from "../controllers/ingredientsControllers.js";

const router = express.Router();

router.get("/", getAllIngredientNames);
router.get("/:id", getIngredientNameByid);

export default router;
