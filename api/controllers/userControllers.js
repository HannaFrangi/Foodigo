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
    const { name } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;

    if (req.file) {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete existing profile picture if one exists
      if (user.ProfilePicURL) {
        const oldPicRef = ref(storage, user.ProfilePicURL);
        await deleteObject(oldPicRef);
      }

      // Generate a consistent filename using user's MongoDB _id
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `${req.user._id}.${fileExtension}`;

      const metadata = {
        contentType: req.file.mimetype,
        customMetadata: {
          userId: req.user._id.toString(),
        },
      };

      // Create storage reference with user ID as filename
      const storageRef = ref(storage, `profilePics/${fileName}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);

      // Get download URL
      const downloadURL = await getDownloadURL(
        ref(storage, snapshot.metadata.fullPath)
      );

      // Update fields with new profile picture URL
      updateFields.ProfilePicURL = downloadURL;
    }

    // Update user in database
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

    // Return updated user info
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
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

export const AddToFavorites = async (req, res) => {
  try {
    // Input validation
    const { recipeId } = req.body;
    if (!recipeId || typeof recipeId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid recipe ID is required",
      });
    }

    // Validate recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Find and update user using findOneAndUpdate to ensure atomic operation
    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $addToSet: { recipeFavorites: recipeId }, // Adds recipeId if it's not already in the array
      },
      { new: true } // Returns the updated document
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the recipe was actually added (wasn't already in favorites)
    const wasAdded = result.recipeFavorites.includes(recipeId);

    if (wasAdded) {
      return res.status(200).json({
        success: true,
        message: "Recipe added to favorites successfully",
        isFavorited: true,
      });
    } else {
      // If recipe was already in favorites, remove it
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { recipeFavorites: recipeId }, // Removes recipeId from the array
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Recipe removed from favorites successfully",
        isFavorited: false,
      });
    }
  } catch (error) {
    console.error("Error in AddToFavorites:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while updating favorites",
      error: error.message,
    });
  }
};

const standardizeQuantity = (quantityStr) => {
  try {
    // Extract number and unit from string (e.g., "2 cups" -> { value: 2, unit: "cups" })
    const match = quantityStr.trim().match(/^([\d.]+)\s*([a-zA-Z]+)$/);
    if (!match) return null;

    const [, value, unit] = match;
    const numValue = parseFloat(value);

    // Map common unit variations to standard units
    const unitMap = {
      // Volume
      cup: "cup",
      cups: "cup",
      c: "cup",
      tablespoon: "Tbs",
      tablespoons: "Tbs",
      tbsp: "Tbs",
      tbs: "Tbs",
      teaspoon: "tsp",
      teaspoons: "tsp",
      tsp: "tsp",
      ml: "ml",
      milliliter: "ml",
      milliliters: "ml",
      l: "l",
      liter: "l",
      liters: "l",
      // Mass
      g: "g",
      gram: "g",
      grams: "g",
      kg: "kg",
      kilogram: "kg",
      kilograms: "kg",
      oz: "oz",
      ounce: "oz",
      ounces: "oz",
      lb: "lb",
      pound: "lb",
      pounds: "lb",
      // Add more mappings as needed
    };

    const standardUnit = unitMap[unit.toLowerCase()];
    if (!standardUnit) return null;

    let standardValue;
    let standardizedUnit;

    // Convert to standard units based on type
    if (["cup", "Tbs", "tsp", "ml", "l"].includes(standardUnit)) {
      // Convert all volume measurements to milliliters
      standardValue = convert(numValue).from(standardUnit).to("ml");
      standardizedUnit = "ml";
    } else if (["g", "kg", "oz", "lb"].includes(standardUnit)) {
      // Convert all mass measurements to grams
      standardValue = convert(numValue).from(standardUnit).to("g");
      standardizedUnit = "g";
    } else {
      return null;
    }

    return {
      value: standardValue,
      unit: standardizedUnit,
    };
  } catch (error) {
    console.error("Error in standardizeQuantity:", error);
    return null;
  }
};

// Helper function to format quantity for display
const formatQuantity = (value, unit) => {
  let displayValue, displayUnit;

  if (unit === "ml") {
    if (value >= 1000) {
      displayValue = (value / 1000).toFixed(2);
      displayUnit = "L";
    } else {
      displayValue = Math.round(value);
      displayUnit = "ml";
    }
  } else if (unit === "g") {
    if (value >= 1000) {
      displayValue = (value / 1000).toFixed(2);
      displayUnit = "kg";
    } else {
      displayValue = Math.round(value);
      displayUnit = "g";
    }
  } else {
    return `${value} ${unit}`;
  }

  return `${displayValue} ${displayUnit}`;
};

export const AddtoGroceryList = async (req, res) => {
  try {
    const { ingredientID, quantity } = req.body;
    const userID = req.user._id;

    if (!ingredientID) {
      return res.status(400).json({
        success: false,
        message: "Ingredient ID is required",
      });
    }

    // Find the user
    const user = await User.findById(userID);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Standardize the new quantity if provided
    let standardizedNewQuantity = null;
    if (quantity) {
      standardizedNewQuantity = standardizeQuantity(quantity);
      if (!standardizedNewQuantity && quantity.trim() !== "") {
        return res.status(400).json({
          success: false,
          message:
            "Invalid quantity format. Please use format like '2 cups' or '500 g'",
        });
      }
    }

    // Check if ingredient already exists in the grocery list
    const existingItem = user.groceryList.find((item) =>
      item.ingredientID.some((id) => id.toString() === ingredientID.toString())
    );

    if (existingItem) {
      // Reset isPurchased if it was true
      if (existingItem.isPurchased) {
        existingItem.isPurchased = false;
      }

      // Handle quantity updates
      if (existingItem.quantity && standardizedNewQuantity) {
        const existingStandardized = standardizeQuantity(existingItem.quantity);

        if (
          existingStandardized &&
          existingStandardized.unit === standardizedNewQuantity.unit
        ) {
          // Add quantities if units are compatible
          const totalValue =
            existingStandardized.value + standardizedNewQuantity.value;
          existingItem.quantity = formatQuantity(
            totalValue,
            existingStandardized.unit
          );
        } else {
          // If units are incompatible or can't parse, keep both quantities
          existingItem.quantity = `${existingItem.quantity}, ${quantity}`;
        }
      } else if (standardizedNewQuantity) {
        existingItem.quantity = formatQuantity(
          standardizedNewQuantity.value,
          standardizedNewQuantity.unit
        );
      }
    } else {
      // Add new item
      user.groceryList.push({
        ingredientID: [ingredientID],
        quantity: standardizedNewQuantity
          ? formatQuantity(
              standardizedNewQuantity.value,
              standardizedNewQuantity.unit
            )
          : quantity || "",
        isPurchased: false,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: existingItem
        ? "Item updated in grocery list"
        : "New item added to grocery list",
      groceryList: user.groceryList,
    });
  } catch (error) {
    console.error("Error in AddtoGroceryList:", error);
    res.status(500).json({
      success: false,
      message: "Error adding item to grocery list",
      error: error.message,
    });
  }
};

export const togglePurchasedStatus = async (req, res) => {
  try {
    const { groceryItemId } = req.body;
    const userID = req.user._id;

    if (!groceryItemId) {
      return res.status(400).json({
        success: false,
        message: "Grocery item ID is required",
      });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const groceryItem = user.groceryList.id(groceryItemId);
    if (!groceryItem) {
      return res.status(404).json({
        success: false,
        message: "Grocery item not found",
      });
    }

    groceryItem.isPurchased = !groceryItem.isPurchased;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Item marked as ${
        groceryItem.isPurchased ? "purchased" : "not purchased"
      }`,
      // groceryList: user.groceryList,
    });
  } catch (error) {
    console.error("Error in togglePurchasedStatus:", error);
    res.status(500).json({
      success: false,
      message: "Error updating purchase status",
      error: error.message,
    });
  }
};

export const getUserInfoByID = async (req, res) => {
  const userID = req.params.id;

  try {
    const user = await User.findById(userID, "name ProfilePicURL");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserInfoByID:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
