import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Recipe from "../models/Recipe.js";
import Category from "../models/Category.js";
import Area from "../models/Area.js";
import Ingredient from "../models/Ingredient.js"; // Import Ingredient model

dotenv.config();

const mongoDBUri =
  "mongodb+srv://majdchbat:tSvXdHgpIdEbb45G@cluster0.knx1g.mongodb.net/foodigo_db?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const createAreaIfNotExists = async (areaName) => {
  try {
    let area = await Area.findOne({ name: areaName });
    if (!area) {
      area = new Area({ name: areaName });
      await area.save();
      console.log(`Created new area: ${areaName}`);
    }
    return area._id;
  } catch (error) {
    console.error(`Error creating/finding area ${areaName}:`, error.message);
    return null;
  }
};

// Updated function to use "ingredients" collection
const createIngredientIfNotExists = async (ingredientName) => {
  try {
    let ingredient = await Ingredient.findOne({ name: ingredientName });
    if (!ingredient) {
      ingredient = new Ingredient({ name: ingredientName }); // Use Ingredient model
      await ingredient.save();
      console.log(`Created new ingredient: ${ingredientName}`);
    }
    return ingredient._id;
  } catch (error) {
    console.error(
      `Error creating/finding ingredient ${ingredientName}:`,
      error.message
    );
    return null;
  }
};

const fetchAndSaveRecipes = async () => {
  try {
    const allCategories = await Category.find({});
    console.log(`Found ${allCategories.length} categories in database`);

    const allIngrediants = await Ingredient.find({});
    console.log(`Found ${allIngrediants.length} ingredients in database`);

    let startId = 52772;
    let endId = 53085;
    let totalAdded = 0;
    let totalSkipped = 0;
    let notFound = 0;
    let areasAdded = new Set();

    for (let x = startId; x <= endId; x++) {
      try {
        console.log(`Fetching recipe with ID: ${x}`);
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${x}`
        );
        const recipes = response.data.meals;

        if (!recipes) {
          console.log(`No recipe found for ID: ${x}`);
          notFound++;
          continue;
        }

        for (const recipe of recipes) {
          try {
            const existingRecipe = await Recipe.findOne({
              recipeTitle: recipe.strMeal,
            });

            if (existingRecipe) {
              console.log(`Skipping duplicate recipe: ${recipe.strMeal}`);
              totalSkipped++;
              continue;
            }

            const origin = recipe.strArea || "Unknown";
            const areaId = await createAreaIfNotExists(origin);
            if (areaId && !areasAdded.has(origin)) {
              areasAdded.add(origin);
            }

            const recipeIngredients = [];
            for (let i = 1; i <= 20; i++) {
              const ingredientName = recipe[`strIngredient${i}`];
              const measure = recipe[`strMeasure${i}`];
              if (ingredientName && ingredientName.trim()) {
                const ingredientId = await createIngredientIfNotExists(
                  ingredientName.trim()
                );
                if (ingredientId) {
                  recipeIngredients.push({
                    ingredientName: ingredientId,
                    quantity: measure ? measure.trim() : "",
                  });
                }
              }
            }

            const mealCategory = recipe.strCategory || "Unknown";

            const categoryMatches = allCategories.filter(
              (cat) =>
                cat.name.toLowerCase() === origin.toLowerCase() ||
                cat.name.toLowerCase() === mealCategory.toLowerCase()
            );

            const categoryIds = categoryMatches.map((category) => category._id);

            const newRecipe = new Recipe({
              recipeTitle: recipe.strMeal,
              recipeIngredients: recipeIngredients,
              recipeImage: recipe.strMealThumb,
              recipeVideoTutorial: recipe.strYoutube || "",
              area: areaId,
              recipeInstructions: recipe.strInstructions,
              categories: categoryIds,
            });

            await newRecipe.save();
            totalAdded++;
            console.log(
              `Recipe saved: ${recipe.strMeal} with ${categoryIds.length} categories`
            );
          } catch (error) {
            console.error(
              `Error processing recipe ${recipe.strMeal}:`,
              error.message
            );
            continue;
          }
        }
      } catch (error) {
        console.error(`Error fetching recipe ID ${x}:`, error.message);
        continue;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\nFinal Import Summary:");
    console.log(`ID Range Processed: ${startId} to ${endId}`);
    console.log(`Total recipes added: ${totalAdded}`);
    console.log(`Total duplicates skipped: ${totalSkipped}`);
    console.log(`Recipes not found: ${notFound}`);
    console.log(`New areas added: ${Array.from(areasAdded).join(", ")}`);
    console.log("Import process completed");
  } catch (error) {
    console.error("Error in main process:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Execute the function
fetchAndSaveRecipes();
