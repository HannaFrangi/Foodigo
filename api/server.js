import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// routes
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config(); // Corrected to dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

app.get("/api", (req, res) => {
  res.send("Hi! Welcome to Foodigo API.");
});

app.use(express.json());
app.use(cookieParser()); //so we can send the cookie in the res.cookie in authController.js

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  connectDB(); // Establishes connection to MongoDB when server starts
});
