import express from "express";

import { getUsersForTable, getStats } from "../controllers/AdminController.js";
import { AdminRoute } from "../middleware/Admin.js";

const router = express.Router();

router.get("/", AdminRoute, getStats);
router.get("/users", AdminRoute, getUsersForTable);

export default router;
