import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the grocery list item schema separately for better organization
const groceryListItemSchema = new mongoose.Schema({
  ingredientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
  quantity: {
    type: String,
    default: "",
    required: true,
  },
  isPurchased: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  ProfilePicURL: {
    type: String,
    default: "",
  },
  recipeFavorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  groceryList: [groceryListItemSchema],
});

// Only hash password if it's modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

const User = mongoose.model("User", userSchema);

export default User;
