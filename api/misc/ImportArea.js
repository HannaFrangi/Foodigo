import mongoose from "mongoose";
import axios from "axios";
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

// Function to fetch categories from TheMealDB API and insert into MongoDB
const importCategories = async () => {
  try {
    // Fetch categories from TheMealDB API
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const areas = response.data.meals; // Corrected to reference 'meals'

    // Loop through each area and insert into the database
    for (const areaData of areas) {
      // Changed to areaData for clarity
      const { strArea } = areaData;

      // Check if the category already exists to avoid duplicates
      const existingCategory = await Area.findOne({ name: strArea }); // Use Area model
      if (existingCategory) {
        console.log(`Category ${strArea} already exists. Skipping...`);
        continue;
      }

      // Create and save a new category document
      const newCategory = new Area({
        // Use Area model here
        name: strArea,
      });

      await newCategory.save();
      console.log(`Category ${strArea} imported successfully`);
    }

    console.log("All Areas imported successfully!");
  } catch (error) {
    console.error("Error importing Areas:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the import function
importCategories();
