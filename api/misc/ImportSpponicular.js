import mongoose from 'mongoose';
import axios from 'axios';
import Recipe from '../models/Recipe.js';
import Category from '../models/Category.js';
import Area from '../models/Area.js';
import Ingredient from '../models/Ingredient.js';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import pLimit from 'p-limit'; // <-- Add this line

// --- Configuration and Initialization ---
const firebaseConfig = {
  apiKey: 'AIzaSyCYUIfiZEdqmr2XbdSP0tdtMrAiAeL6IaM',
  authDomain: 'hdarne-3d2b6.firebaseapp.com',
  projectId: 'hdarne-3d2b6',
  storageBucket: 'hdarne-3d2b6.appspot.com',
  messagingSenderId: '137464243804',
  appId: '1:137464243804:web:933b0aeddfd4c6d72ca899',
  measurementId: 'G-TT3XYP63T1',
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const mongoDBUri = '';
const spoonacularApiKey = '';
const userIdPlaceholder = '675afaab143c11f684324a06';

const CONCURRENCY_LIMIT = 10; // Tune this based on your API/db limits
const RECIPES_TO_FETCH = 1000;

const limit = pLimit(CONCURRENCY_LIMIT);

// --- Utility Functions ---
async function uploadImageToFirebase(imageUrl, recipeName) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const fileName = `${Date.now()}_${recipeName.replace(/\s+/g, '_')}.jpg`;
    const storageRef = ref(storage, `recipes/${fileName}`);
    const metadata = { contentType: 'image/jpeg' };
    const snapshot = await uploadBytes(storageRef, buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`Successfully uploaded image for ${recipeName}`);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading image for ${recipeName}:`, error.message);
    return null;
  }
}

const formatName = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const createOrFindModel = async (Model, name) => {
  const formattedName = formatName(name);
  const query = { name: formattedName };
  let doc = await Model.findOne(query);
  if (!doc) {
    doc = new Model(query);
    await doc.save();
    console.log(`Created new ${Model.modelName}: ${formattedName}`);
  }
  return doc._id;
};

const fetchAndSaveSingleRecipe = async (
  processedTitles,
  categoryMap,
  areaMap,
  ingredientMap
) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random?apiKey=${spoonacularApiKey}&number=1`
    );
    const recipe = response.data.recipes[0];

    if (!recipe || processedTitles.has(recipe.title)) {
      return { skipped: 1, added: 0 };
    }
    processedTitles.add(recipe.title);

    const existingRecipe = await Recipe.findOne({
      recipeTitle: recipe.title,
    });
    if (existingRecipe) {
      return { skipped: 1, added: 0 };
    }

    const firebaseImageUrl = await uploadImageToFirebase(
      recipe.image,
      recipe.title
    );
    if (!firebaseImageUrl) {
      return { skipped: 1, added: 0 };
    }

    const areaName = formatName(recipe.cuisines?.[0] || 'Unknown');
    const areaId =
      areaMap.get(areaName.toLowerCase()) ||
      (await createOrFindModel(Area, areaName));
    if (!areaMap.has(areaName.toLowerCase()))
      areaMap.set(areaName.toLowerCase(), areaId);

    const ingredientsWithIds = await Promise.all(
      recipe.extendedIngredients.map(async (ing) => {
        const ingName = formatName(ing.name);
        const ingId =
          ingredientMap.get(ingName.toLowerCase()) ||
          (await createOrFindModel(Ingredient, ingName));
        if (!ingredientMap.has(ingName.toLowerCase()))
          ingredientMap.set(ingName.toLowerCase(), ingId);
        return {
          ingredientName: ingId,
          quantity: ing.amount ? ing.amount.toString() : '',
        };
      })
    );

    const categoryIds = recipe.dishTypes
      ? recipe.dishTypes
          .map((dishType) => categoryMap.get(dishType.toLowerCase()))
          .filter((id) => id)
      : [];

    const newRecipe = new Recipe({
      recipeTitle: recipe.title,
      recipeIngredients: ingredientsWithIds,
      recipeImage: firebaseImageUrl,
      recipeVideoTutorial: recipe.sourceUrl || '',
      userId: userIdPlaceholder,
      area: areaId,
      recipeInstructions: recipe.instructions,
      categories: categoryIds,
    });

    await newRecipe.save();
    console.log(`Recipe saved: ${recipe.title}`);
    return { skipped: 0, added: 1 };
  } catch (error) {
    console.error(`Error processing recipe:`, error.message);
    return { skipped: 1, added: 0 };
  }
};

// --- Main Data Fetch and Save Logic ---
const fetchAndSaveRecipes = async () => {
  await mongoose.connect(mongoDBUri);
  console.log('MongoDB connected');

  try {
    // Pre-fetch all categories, areas, and ingredients for efficient lookup
    const allCategories = await Category.find({});
    const allAreas = await Area.find({});
    const allIngredients = await Ingredient.find({}); // Create in-memory maps for faster lookup

    const categoryMap = new Map(
      allCategories.map((cat) => [cat.name.toLowerCase(), cat._id])
    );
    const areaMap = new Map(
      allAreas.map((area) => [area.name.toLowerCase(), area._id])
    );
    const ingredientMap = new Map(
      allIngredients.map((ing) => [ing.name.toLowerCase(), ing._id])
    );

    const processedTitles = new Set();
    let totalAdded = 0;
    let totalSkipped = 0;

    // Create an array of promises with concurrency limit
    const tasks = Array.from({ length: RECIPES_TO_FETCH }, () =>
      limit(() =>
        fetchAndSaveSingleRecipe(
          processedTitles,
          categoryMap,
          areaMap,
          ingredientMap
        )
      )
    );

    // Wait for all tasks to finish
    const results = await Promise.all(tasks);

    // Aggregate results
    for (const res of results) {
      totalAdded += res.added;
      totalSkipped += res.skipped;
    }

    console.log(
      `\nFinal Import Summary:\nTotal recipes added: ${totalAdded}\nTotal duplicates/failures skipped: ${totalSkipped}`
    );
  } catch (error) {
    console.error('Error in main process:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

fetchAndSaveRecipes();
