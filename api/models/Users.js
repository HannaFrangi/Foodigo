import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ref } from "firebase/storage";

const userSchema = new mongoose.Schema({
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
  isVerified: { type: Boolean, default: false },
  // bio: { type: String, default: "" },
  ProfilePicURL: { type: String, default: "" },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  recipeFavorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  createdAt: { type: Date, default: Date.now },
  groceryList: [
    {
      ingredientID: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
      ],
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

const User = mongoose.model("User", userSchema);

export default User;
