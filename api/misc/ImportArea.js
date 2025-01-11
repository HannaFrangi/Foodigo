import mongoose from "mongoose";
import axios from "axios";
import Area from "../models/Area.js"; // Ensure this path is correct

// MongoDB connection URI
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://majdchbat:tSvXdHgpIdEbb45G@cluster0.knx1g.mongodb.net/foodigo_db?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
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
    // Fetch areas from the Areas.json file (replace with the correct URL if necessary)
    const response = await axios.get("http://localhost/Areas.json");

    // Assuming the response contains an array of areas
    const areas = response.data; // If the areas are at a different path, adjust accordingly

    // Loop through each area and insert it into the database
    for (const area of areas) {
      // Assuming each area has a 'name' and other fields
      const { name } = area; // Modify this based on actual JSON structure

      // Check if the area already exists in the database to avoid duplicates
      const existingArea = await Area.findOne({ name });
      if (existingArea) {
        console.log(`Area "${name}" already exists. Skipping...`);
        continue;
      }

      // Create a new area document and save it
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
    mongoose.connection.close(); // Close the MongoDB connection after import
  }
};

// Run the import function
importAreas();
