import express from "express";
import {
  createArea,
  getAllAreas,
  getAreaByid,
} from "../controllers/AreaControllers.js";
import { cacheMiddleware } from "../config/cache.js";

const router = express.Router();

router.post("/", createArea);
router.get("/getareabyid/:id", cacheMiddleware(1800), getAreaByid);
router.get("/", cacheMiddleware(1800), getAllAreas);

export default router;
