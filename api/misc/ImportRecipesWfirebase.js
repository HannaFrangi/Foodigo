import mongoose from "mongoose";
import axios from "axios";
import Recipe from "../models/Recipe.js";
import Category from "../models/Category.js";
import Area from "../models/Area.js";
import Ingredient from "../models/Ingredient.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration with hardcoded values
const firebaseConfig = {
  apiKey: "AIzaSyCYUIfiZEdqmr2XbdSP0tdtMrAiAeL6IaM",
  authDomain: "hdarne-3d2b6.firebaseapp.com",
  projectId: "hdarne-3d2b6",
  storageBucket: "hdarne-3d2b6.appspot.com",
  messagingSenderId: "137464243804",
  appId: "1:137464243804:web:933b0aeddfd4c6d72ca899",
  measurementId: "G-TT3XYP63T1",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// MongoDB connection string
const mongoDBUri =
  "mongodb+srv://majdchbat:tSvXdHgpIdEbb45G@cluster0.knx1g.mongodb.net/foodigo_db?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to download image from URL and upload to Firebase
async function uploadImageToFirebase(imageUrl, recipeName) {
  try {
    // Download image from URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Generate unique filename
    const fileName = `${Date.now()}_${recipeName.replace(/\s+/g, "_")}.jpg`;

    // Create storage reference
    const storageRef = ref(storage, `recipes/${fileName}`);

    // Upload to Firebase
    const metadata = {
      contentType: "image/jpeg",
      customMetadata: {
        recipeName: recipeName,
      },
    };

    const snapshot = await uploadBytes(storageRef, buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log(`Successfully uploaded image for ${recipeName}`);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading image for ${recipeName}:`, error);
    return null;
  }
}

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

const formatIngredientName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const createIngredientIfNotExists = async (ingredientName) => {
  try {
    const formattedName = formatIngredientName(ingredientName);
    let ingredient = await Ingredient.findOne({ name: formattedName });
    if (!ingredient) {
      ingredient = new Ingredient({ name: formattedName });
      await ingredient.save();
      console.log(`Created new ingredient: ${formattedName}`);
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
    let imageUploadsFailed = 0;

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

            // Upload image to Firebase
            const firebaseImageUrl = await uploadImageToFirebase(
              recipe.strMealThumb,
              recipe.strMeal
            );

            if (!firebaseImageUrl) {
              console.log(
                `Failed to upload image for ${recipe.strMeal}, skipping recipe`
              );
              imageUploadsFailed++;
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
              recipeImage: firebaseImageUrl,
              recipeVideoTutorial: recipe.strYoutube || "",
              userId: "675afaab143c11f684324a06",
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

      // Add delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\nFinal Import Summary:");
    console.log(`ID Range Processed: ${startId} to ${endId}`);
    console.log(`Total recipes added: ${totalAdded}`);
    console.log(`Total duplicates skipped: ${totalSkipped}`);
    console.log(`Recipes not found: ${notFound}`);
    console.log(`Image uploads failed: ${imageUploadsFailed}`);
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
