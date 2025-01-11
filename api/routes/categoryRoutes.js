import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoryControllers.js";
import { cacheMiddleware } from "../config/cache.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", cacheMiddleware(1800), getAllCategories);

export default router;
