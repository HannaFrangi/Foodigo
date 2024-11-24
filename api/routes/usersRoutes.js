import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.js";
import {
  AddtoFavorites,
  AddtoGroceryList,
  togglePurchasedStatus,
  updateProfile,
} from "../controllers/userControllers.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);

router.put("/addtofavorites/:id", protectRoute, AddtoFavorites);

router.post("/addToGroceryList/", protectRoute, AddtoGroceryList);
router.patch("/togglepurchased", protectRoute, togglePurchasedStatus);

export default router;
