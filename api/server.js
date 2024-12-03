import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Adding CORS support

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
const PORT = process.env.PORT || 5001;

// // Create server with http and integrate socket.io
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Allow requests from Vite's development server
//     credentials: true, // Allow cookies to be sent with requests
//   },
// });

app.use(
  cors({
    // origin: "http://192.168.1.9:5173",
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies for auth

// Test Route
app.get("/api", (req, res) => {
  res.send("Hi! Welcome to Foodigo API.");
});

// Route middleware
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/ingredients", ingredientsRoutes);

// Listen for socket connections
// io.on("connection", (socket) => {
//   console.log("A user connected with socket ID:", socket.id);

//   // You can access the query parameter (userId) here if needed
//   const userId = socket.handshake.query.userId;
//   console.log("User ID from query:", userId);

//   // Listen for disconnect events
//   socket.on("disconnect", () => {
//     console.log(`User with ID ${userId} disconnected`);
//   });
// });

// Start Server
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
