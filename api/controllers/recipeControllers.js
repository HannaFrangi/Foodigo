import Area from "../models/Area.js";
import Recipe from "../models/Recipe.js";
import Ingredient from "../models/Ingredient.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase.js";

export const createRecipe = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const recipeData = { ...req.body };

    if (req.file) {
      // Generate filename using userId and timestamp for uniqueness
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${req.user._id}_${Date.now()}.${fileExtension}`;

      const metadata = {
        contentType: req.file.mimetype,
        customMetadata: {
          userId: req.user._id.toString(),
          recipeTitle: recipeData.recipeTitle,
        },
      };

      // Create storage reference
      const storageRef = ref(storage, `recipes/${fileName}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);

      // Get download URL
      const downloadURL = await getDownloadURL(
        ref(storage, snapshot.metadata.fullPath)
      );

      // Update recipe data with the image URL
      recipeData.recipeImage = downloadURL;
    }

    // Create recipe in database
    const newRecipe = await Recipe.create({
      ...recipeData,
      userId: req.user._id,
    });

    if (!newRecipe) {
      return res.status(404).json({
        success: false,
        message: "Failed to create recipe",
      });
    }

    // Return created recipe info
    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error creating recipe",
      error: error.message,
    });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the recipe due to server error",
    });
  }
};

export const getRecipesByName = async (req, res) => {
  const searchTerm = req.query.recipeTitle;
  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: "Please provide a search term.",
    });
  }

  try {
    const recipes = await Recipe.find({
      recipeTitle: { $regex: new RegExp(searchTerm, "i") },
    });

    if (recipes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recipes found with that name.",
      });
    }

    return res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    console.error("Error searching for recipes by name:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search for recipes due to server error",
    });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error in getAllRecipes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this recipe",
      });
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error("Error in updateRecipe:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    // Find the recipe by ID
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Check if the user is authorized to delete the recipe
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this recipe",
      });
    }

    // Check if the recipe has an image URL and delete it from Firebase Storage
    if (recipe.recipeImage) {
      const imageRef = ref(storage, recipe.recipeImage);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image from Firebase Storage:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to delete recipe image from storage",
          error: error.message,
        });
      }
    }

    // Delete the recipe from the database
    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error in deleteRecipe:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    const existingReview = recipe.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this recipe",
      });
    }
    const newReview = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: Date.now(),
    };

    recipe.reviews.push(newReview);
    await recipe.save();
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const editReview = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    const review = recipe.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await recipe.save();
    res.json({ success: true, data: review });
  } catch (error) {
    console.error("Error in editReview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    const reviewIndex = recipe.reviews.findIndex(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (reviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    recipe.reviews.splice(reviewIndex, 1);
    await recipe.save();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLatestRecipe = async (req, res) => {
  const limit = 12;
  try {
    const latestRecipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: latestRecipes,
    });
  } catch (error) {
    console.error("Error fetching latest recipes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the latest recipes due to server error",
    });
  }
};

export const getRandomRecipe = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomRecipe = await Recipe.findOne().skip(randomIndex);

    if (!randomRecipe) {
      return res.status(404).json({
        success: false,
        message: "No recipes found",
      });
    }

    return res.status(200).json({
      success: true,
      data: randomRecipe,
    });
  } catch (error) {
    console.error("Error fetching random recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve a random recipe due to server error",
    });
  }
};

export const getRecipesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const recipes = await Recipe.find({ categories: categoryId }).populate(
      "categories"
    );

    if (!recipes.length) {
      return res.status(404).json({
        success: false,
        message: "No recipes found for this category",
      });
    }

    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error fetching recipes by category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRecipesByArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    // Validate if areaId is provided
    if (!areaId) {
      return res.status(400).json({
        success: false,
        message: "Area ID is required",
      });
    }

    // First check if the area exists
    const area = await Area.findById(areaId);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    // Find all recipes for this area with populated categories
    const recipes = await Recipe.find({ area: areaId })
      .populate("area")
      .populate("categories")
      .select("-reviews") // Exclude reviews for better performance
      .sort({ createdAt: -1 }); // Sort by newest first

    // Return appropriate response based on whether recipes were found
    if (recipes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No recipes found for this area",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recipes retrieved successfully",
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error("Error in getRecipesByArea:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getRecipesByAreaName = async (req, res) => {
  try {
    const { areaName } = req.params;

    // Validate if areaName is provided
    if (!areaName) {
      return res.status(400).json({
        success: false,
        message: "Area name is required",
      });
    }

    // First find the area by name
    const area = await Area.findOne({
      name: { $regex: new RegExp(areaName, "i") }, // Case-insensitive search
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    // Find all recipes for this area with populated categories
    const recipes = await Recipe.find({ area: area._id })
      .populate("area")
      .populate("categories")
      .select("-reviews")
      .sort({ createdAt: -1 });

    if (recipes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No recipes found for this area",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recipes retrieved successfully",
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error("Error in getRecipesByAreaName:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;

    if (!ingredients || ingredients.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No ingredients provided for search",
      });
    }

    const ingredientNames = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim().toLowerCase());

    const ingredientIds = await Ingredient.find({
      name: {
        $in: ingredientNames.map((name) => new RegExp(`^${name}$`, "i")),
      },
    }).select("_id");

    if (ingredientIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ingredients found with the provided names",
      });
    }

    // Convert ingredientIds to an array of ObjectIds
    const ingredientObjectIds = ingredientIds.map(
      (ingredient) => ingredient._id
    );

    // Find recipes that contain any of the ingredients by matching the ingredient ObjectIds
    const recipes = await Recipe.find({
      "recipeIngredients.ingredientName": { $in: ingredientObjectIds },
    }).populate("recipeIngredients.ingredientName"); // Optional: populate ingredient details

    // If no recipes are found that contain the ingredients
    if (recipes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recipes found with the specified ingredients",
      });
    }

    // Count the total number of matching recipes
    const count = recipes.length;

    // Return the recipes along with the count
    return res.status(200).json({
      success: true,
      count: count,
      data: recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes by ingredients:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recipes due to server error",
    });
  }
};

export const getRecipesByIngredientsId = async (req, res) => {
  try {
    const { ingredientIds } = req.query;

    if (!ingredientIds || ingredientIds.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No ingredient IDs provided for search",
      });
    }

    const ingredientObjectIds = ingredientIds.split(",").map((id) => id.trim());

    const recipes = await Recipe.find({
      "recipeIngredients.ingredientName": { $in: ingredientObjectIds },
    }).populate("recipeIngredients.ingredientName");

    if (recipes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recipes found with the specified ingredient IDs",
      });
    }

    const count = recipes.length;

    return res.status(200).json({
      success: true,
      count: count,
      data: recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes by ingredient IDs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recipes due to server error",
    });
  }
};
