import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryControllers.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getAllCategories);

export default router;
