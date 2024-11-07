import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import User from "../models/Users.js";
import Recipe from "../models/Recipe.js";
import { storage } from "../config/firebase.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    if (req.file) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.ProfilePicURL) {
        const oldPicRef = ref(storage, user.ProfilePicURL);
        await deleteObject(oldPicRef);
      }

      const metadata = {
        contentType: req.file.mimetype,
      };
      const fileName = `${req.user._id}-${Date.now()}-${req.file.originalname}`;
      const storageRef = ref(storage, `profilePics/${fileName}`);
      const fileBuffer = req.file.buffer;

      const snapshot = await uploadBytes(storageRef, fileBuffer, metadata);

      const downloadURL = await getDownloadURL(
        ref(storage, snapshot.metadata.fullPath)
      );

      updateFields.ProfilePicURL = downloadURL;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        ProfilePicURL: updatedUser.ProfilePicURL,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const AddtoFavorites = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }
    const user = await User.findById(req.user._id);
    const favoriteIndex = user.recipeFavorites.indexOf(recipeId);

    if (favoriteIndex !== -1) {
      user.recipeFavorites.splice(favoriteIndex, 1);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Recipe removed from favorites successfully",
      });
    } else {
      user.recipeFavorites.push(recipeId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Recipe added to favorites successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating favorites: " + error.message,
    });
  }
};
