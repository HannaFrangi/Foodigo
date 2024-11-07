import express from "express";

//AUthRoutes

import {
  signup,
  login,
  logout,
  CheckerificationEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", CheckerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protectRoute, (req, res) => {
  res.send({
    success: true,
    user: req.user,
  });
});

export default router;
