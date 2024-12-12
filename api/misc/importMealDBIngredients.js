import mongoose from "mongoose";
import axios from "axios";
import Ingredient from "../models/Ingredient.js";

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

// Function to fetch ingredients from TheMealDB API and insert into MongoDB
const importIngredients = async () => {
  try {
    // Fetch ingredients from TheMealDB API
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    const ingredients = response.data.meals;

    // Loop through each ingredient and insert into the database
    for (const ingredientData of ingredients) {
      const { strIngredient } = ingredientData;

      // Check if the ingredient already exists to avoid duplicates
      const existingIngredient = await Ingredient.findOne({
        name: strIngredient,
      });
      if (existingIngredient) {
        console.log(`Ingredient ${strIngredient} already exists. Skipping...`);
        continue;
      }

      // Create and save a new ingredient document
      const newIngredient = new Ingredient({
        name: strIngredient,
      });
      await newIngredient.save();
      console.log(`Ingredient ${strIngredient} imported successfully`);
    }

    console.log("All Ingredients imported successfully!");
  } catch (error) {
    console.error("Error importing Ingredients:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the import function
importIngredients();
