import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  // Updated to "userSchema"
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // bio: { type: String, default: "" },
  ProfilePicURL: { type: String, default: "" },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Added Favorites
  recipeFavorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],

  //Added CreatedAt
  createdAt: { type: Date, default: Date.now },

  groceryList: [
    {
      ingredientName: { type: String, required: true },
      quantity: { type: String, default: "" },
      isPurchased: { type: Boolean, default: false },
    },
  ],
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema); // Consistently use "userSchema"

export default User;
