import express from "express";
import { createArea, getAllAreas } from "../controllers/AreaControllers.js";

const router = express.Router();

router.post("/", createArea);
router.get("/", getAllAreas);

export default router;
