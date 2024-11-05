import mongoose from "mongoose";
import axios from "axios";
import Category from "../models/Category.js";

// MongoDB connection
const mongoURI =
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
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const categories = response.data.categories;

    // Loop through each category and insert into the database
    for (const category of categories) {
      const { strCategory, strCategoryDescription } = category;

      // Check if the category already exists to avoid duplicates
      const existingCategory = await Category.findOne({ name: strCategory });
      if (existingCategory) {
        console.log(`Category ${strCategory} already exists. Skipping...`);
        continue;
      }

      // Create and save a new category document
      const newCategory = new Category({
        name: strCategory,
        description: strCategoryDescription,
      });

      await newCategory.save();
      console.log(`Category ${strCategory} imported successfully`);
    }

    console.log("All categories imported successfully!");
  } catch (error) {
    console.error("Error importing categories:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the import function
importCategories();
