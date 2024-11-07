import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

const RecipeSchema = new mongoose.Schema({
  recipeTitle: {
    type: String,
    required: true,
  },
  recipeIngredients: [
    {
      ingredientName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
      },
      quantity: { type: String, required: true },
    },
  ],
  recipeImage: { type: String, required: true },
  recipeVideoTutorial: { type: String, default: "", required: false },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
  },
  recipeInstructions: { type: String, default: "", required: true },
  reviews: [ReviewSchema],
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe;
