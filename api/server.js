import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// routes
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import ingredientsRoutes from "./routes/ingredientsRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies for auth

// Test Route
app.get("/api", (res) => {
  res.send("Hi! Welcome to Foodigo API.");
});

// Route middleware
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/ingredients", ingredientsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/ViteApp/dist")));

  app.get("*", (res) => {
    res.sendFile(path.resolve(__dirname, "ViteApp", "dist", "index.html"));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
