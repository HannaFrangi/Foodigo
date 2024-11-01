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
    const recipe = await Recipe.findById(req.params.id).populate(
      "reviews.user",
      "name profilePicURL"
    );
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    console.error("Error in getRecipeById:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all recipes
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
    // Fetch the recipe
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Check if the logged-in user is the owner of the recipe
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this recipe",
      });
    }

    // Update the recipe if the user is authorized
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
        message: "You do not have permission to delete this recipe",
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

    // Check if the user already submitted a review
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
    res.status(500).json({ success: false, message: "Server error", error });
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

    // Find the review by user ID
    const review = recipe.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Update the review
    review.rating = req.body.rating || review.rating; // Keep existing rating if not updated
    review.comment = req.body.comment || review.comment; // Keep existing comment if not updated

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

    // Find the review by user ID
    const reviewIndex = recipe.reviews.findIndex(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (reviewIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Remove the review
    recipe.reviews.splice(reviewIndex, 1);
    await recipe.save();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
