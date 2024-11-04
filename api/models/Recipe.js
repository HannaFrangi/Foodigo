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
      ingredientName: { type: String, required: true },
      quantity: { type: String, required: true },
    },
  ],
  recipeImage: { type: String, required: true },
  recipeVideoTutorial: { type: String, default: "", required: false },
  recipeOrigin: { type: String, default: "NA", required: true },
  recipeInstructions: { type: String, default: "", required: true },
  recipeBio: { type: String, default: "" },
  reviews: [ReviewSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe;
