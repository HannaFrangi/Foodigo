import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.js";
import {
  AddToFavorites,
  AddtoGroceryList,
  getUserInfoByID,
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

router.get("/getUserInfoByID/:id", getUserInfoByID);
router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);

router.put("/addtofavorites/", protectRoute, AddToFavorites);

router.post("/addToGroceryList/", protectRoute, AddtoGroceryList);
router.patch("/togglepurchased", protectRoute, togglePurchasedStatus);

export default router;
