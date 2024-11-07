import express from "express";

import { signup, login, logout } from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// to check if the user is authenticated
router.get("/me", protectRoute, (req, res) => {
  res.send({
    success: true,
    user: req.user, // This assumes that req.user is set by the protectRoute middleware
  });
});

export default router;
