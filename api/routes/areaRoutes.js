import express from "express";
import {
  createArea,
  getAllAreas,
  getAreaByid,
} from "../controllers/AreaControllers.js";

const router = express.Router();

router.post("/", createArea);
router.get("/getareabyid/:id", getAreaByid);
router.get("/", getAllAreas);

export default router;
