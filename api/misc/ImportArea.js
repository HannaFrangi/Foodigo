import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Area from "../models/Area.js"; // Make sure this path is correct

// MongoDB connection
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://majdchbat:tSvXdHgpIdEbb45G@cluster0.knx1g.mongodb.net/foodigo_db?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Function to import areas from a JSON file
const importAreas = async () => {
  try {
    // Fetch categories from TheMealDB API
    const response = await axios.get("");
    const areas = response.data.meals; // Corrected to reference 'meals'

    // Loop through each area and insert into the database
    for (const area of areasData) {
      const { name } = area;

      // Check if the area already exists to avoid duplicates
      const existingArea = await Area.findOne({ name });
      if (existingArea) {
        console.log(`Area "${name}" already exists. Skipping...`);
        continue;
      }

      // Create and save a new area document
      const newArea = new Area({
        name,
      });

      await newArea.save();
      console.log(`Area "${name}" imported successfully`);
    }

    console.log("All areas imported successfully!");
  } catch (error) {
    console.error("Error importing areas:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the import function
importAreas();
