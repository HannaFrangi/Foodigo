import express from "express";

import {
  getUsersForTable,
  getStats,
  modifyUserAccount,
  getAllUsersX,
  NewestRecipesX,
  getRecipesByNameX,
} from "../controllers/AdminController.js";
import { AdminRoute } from "../middleware/Admin.js";

const router = express.Router();

router.get("/", AdminRoute, getStats);
router.get("/users", AdminRoute, getUsersForTable);
router.get("/all-users", AdminRoute, getAllUsersX);
router.get("/recipes", AdminRoute, NewestRecipesX);
router.get("/recipes/search", AdminRoute, getRecipesByNameX);
router.patch("/users/:userId", AdminRoute, modifyUserAccount);

export default router;
