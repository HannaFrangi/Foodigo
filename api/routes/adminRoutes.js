import express from "express";

import {
  getUsersForTable,
  getStats,
  modifyUserAccount,
} from "../controllers/AdminController.js";
import { AdminRoute } from "../middleware/Admin.js";

const router = express.Router();

router.get("/", AdminRoute, getStats);
router.get("/users", AdminRoute, getUsersForTable);
router.patch("/users/:userId", AdminRoute, modifyUserAccount);

export default router;
