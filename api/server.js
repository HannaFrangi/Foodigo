import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
// routes
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import ingredientsRoutes from "./routes/ingredientsRoutes.js";
import { connectDB } from "./config/db.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // To resolve the __dirname in ES modules
const PORT = process.env.PORT || 5001;

// Import Firebase service account JSON
import serviceAccount from "./config/foodigo.json" assert { type: "json" };
import User from "./models/Users.js";
import { getMessaging, Messaging } from "firebase-admin/messaging";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const messaging = admin.messaging();

// Enable CORS and other middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use environment variable for client URL
    credentials: true,
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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/ingredients", ingredientsRoutes);

// FCM Route
app.post("/api/send-notification", async (req, res) => {
  const { title, body } = req.body;

  // Ensure that all required fields are present
  if (!title || !body) {
    return res
      .status(400)
      .send({ success: false, error: "Missing required fields" });
  }

  try {
    // Fetch all users' tokens from the database
    const users = await User.find({}); // Assuming you have a User model
    const tokens = users
      .filter((user) => user.fcmToken) // Only take users who have an FCM token
      .map((user) => user.fcmToken);

    // If no tokens are available, return an error
    if (tokens.length === 0) {
      return res.status(404).send({ success: false, error: "No tokens found" });
    }
    console.log(tokens);
    // Prepare the message to send
    const message = {
      notification: {
        title, // Title of the notification
        body, // Body of the notification
      },
      tokens, // Array of all tokens to send the message to
    };

    // Send the notification to all tokens
    const response = await getMessaging().sendEachForMulticast(message);
    // Return success response
    res.status(200).send({
      success: true,
      messageId: response.successCount,
      failedCount: response.failureCount,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Production setup for serving static files
if (process.env.NODE_ENV === "production") {
  // Serve static files from the Vite app's build folder
  app.use(express.static(path.join(__dirname, "/ViteApp/dist")));

  // Handle client-side routes in production
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).send("API route not found");
    }
    res.sendFile(path.join(__dirname, "/ViteApp/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error occurred");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
