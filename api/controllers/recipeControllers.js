import Recipe from "../models/Recipe.js";

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const newRecipe = await Recipe.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, data: newRecipe });
  } catch (error) {
    console.error("Error in createRecipe:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single recipe by ID
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

// Search for recipes by name
export const getRecipesByName = async (req, res) => {
  const searchTerm = req.query.recipeTitle;

  console.log("Search Term:", searchTerm);
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

    console.log("Found Recipes:", recipes);

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

// get all Recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error in getAllRecipes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a recipe by ID
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

// Delete a recipe by ID
export const deleteRecipe = async (req, res) => {
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
        message: "Unauthorized to delete this recipe",
      });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error in deleteRecipe:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add a review to a recipe
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
    };
    recipe.reviews.push(newReview);
    await recipe.save();
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Edit a review for a recipe
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

// Delete a review from a recipe
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

// Add a Get Latest Recipe function
export const getLatestRecipe = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
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

// Get a random recipe
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
