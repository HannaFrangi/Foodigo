import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import User from "../models/Users.js";
import Recipe from "../models/Recipe.js";
import convert from "convert-units";
import { storage } from "../config/firebase.js";
import Ingredient from "../models/Ingredient.js";

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

const CONVERSION_FACTORS = {
  cup: 236.588, // ml per cupe
  Tbs: 14.7868, // ml per tablespoon
  tsp: 4.92892, // ml per teaspoon
};

const standardizeQuantity = (quantityStr) => {
  try {
    if (!quantityStr || typeof quantityStr !== "string") return null;

    // Extract number and unit from string (e.g., "2 cups" -> { value: 2, unit: "cups" })
    const match = quantityStr.trim().match(/^([\d.]+)\s*([a-zA-Z]+)$/);
    if (!match) return null;

    const [, value, unit] = match;
    const numValue = parseFloat(value);

    if (isNaN(numValue)) return null;

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
      // Count
      pc: "pcs",
      piece: "pcs",
      pieces: "pcs",
      pcs: "pcs",
      // Miscellaneous
      large: "large",
      grated: "grated",
      diced: "diced",
      sliced: "sliced",
      chopped: "chopped",
      small: "small",
    };

    const standardUnit = unitMap[unit.toLowerCase()];
    if (!standardUnit) return null;

    let standardValue;
    let standardizedUnit;

    // Handle volume conversions
    if (["cup", "Tbs", "tsp"].includes(standardUnit)) {
      standardValue = numValue * CONVERSION_FACTORS[standardUnit];
      standardizedUnit = "ml";
    }
    // Handle direct ml/l measurements
    else if (standardUnit === "ml") {
      standardValue = numValue;
      standardizedUnit = "ml";
    } else if (standardUnit === "l") {
      standardValue = numValue * 1000;
      standardizedUnit = "ml";
    }
    // Handle mass conversions
    else if (["g", "kg", "oz", "lb"].includes(standardUnit)) {
      try {
        standardValue = convert(numValue).from(standardUnit).to("g");
        standardizedUnit = "g";
      } catch (error) {
        console.error("Conversion error:", error);
        return null;
      }
    }
    // Handle piece counts and miscellaneous units
    else if (
      [
        "pcs",
        "large",
        "piece",
        "small ",
        "grated",
        "diced",
        "sliced",
        "chopped",
      ].includes(standardUnit)
    ) {
      return {
        value: numValue,
        unit: standardUnit,
      };
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

const formatQuantity = (value, unit) => {
  try {
    if (typeof value !== "number") return "";

    let displayValue, displayUnit;

    switch (unit) {
      case "ml":
        if (value >= 1000) {
          displayValue = (value / 1000).toFixed(2);
          displayUnit = "L";
        } else {
          displayValue = Math.round(value);
          displayUnit = "ml";
        }
        break;
      case "g":
        if (value >= 1000) {
          displayValue = (value / 1000).toFixed(2);
          displayUnit = "kg";
        } else {
          displayValue = Math.round(value);
          displayUnit = "g";
        }
        break;
      case "pcs":
      case "large":
      case "grated":
      case "diced":
      case "sliced":
      case "chopped":
        displayValue = Math.round(value);
        displayUnit = unit;
        break;
      default:
        return `${value} ${unit}`;
    }

    return `${displayValue} ${displayUnit}`;
  } catch (error) {
    console.error("Error in formatQuantity:", error);
    return "";
  }
};

const parseExistingQuantity = (quantityStr) => {
  if (!quantityStr) return null;

  const match = quantityStr.trim().match(/^([\d.]+)\s*([A-Za-z]+)$/);
  if (!match) return null;

  return {
    value: parseFloat(match[1]),
    unit: match[2].toLowerCase(),
  };
};

export const AddtoGroceryList = async (req, res) => {
  try {
    const { ingredientID, quantity } = req.body;
    const userID = req.user?._id;

    // Validate user
    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Validate ingredientID
    if (!ingredientID) {
      return res.status(400).json({
        success: false,
        message: "Ingredient ID is required.",
      });
    }

    // Check if the ingredient exists
    const ingredientExists = await Ingredient.findById(ingredientID);
    if (!ingredientExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid ingredient ID. Ingredient does not exist.",
      });
    }

    // Standardize the new quantity
    let standardizedNewQuantity = null;
    if (quantity) {
      standardizedNewQuantity = standardizeQuantity(quantity);
      if (!standardizedNewQuantity && quantity.trim() !== "") {
        return res.status(400).json({
          success: false,
          message:
            "Invalid quantity format. Please use format like '2 cups' or '500 g'.",
        });
      }
    }

    // Find the existing item first to get its current quantity
    const existingItem = await User.findOne(
      {
        _id: userID,
        "groceryList.ingredientID": ingredientID,
      },
      { "groceryList.$": 1 }
    );

    let finalQuantity = standardizedNewQuantity;

    if (existingItem && existingItem.groceryList[0]) {
      const existingQuantity = parseExistingQuantity(
        existingItem.groceryList[0].quantity
      );

      if (existingQuantity && standardizedNewQuantity) {
        // Only add quantities if units match or can be converted
        if (existingQuantity.unit === standardizedNewQuantity.unit) {
          finalQuantity = {
            value: existingQuantity.value + standardizedNewQuantity.value,
            unit: standardizedNewQuantity.unit,
          };
        } else {
          // Try to convert units if they're different but compatible
          const existingStandardized = standardizeQuantity(
            `${existingQuantity.value} ${existingQuantity.unit}`
          );
          if (
            existingStandardized &&
            existingStandardized.unit === standardizedNewQuantity.unit
          ) {
            finalQuantity = {
              value: existingStandardized.value + standardizedNewQuantity.value,
              unit: standardizedNewQuantity.unit,
            };
          }
        }
      }
    }

    const formattedQuantity = finalQuantity
      ? formatQuantity(finalQuantity.value, finalQuantity.unit)
      : quantity?.trim() || "";

    // Update the item with the new total quantity
    const updateOperation = await User.findOneAndUpdate(
      {
        _id: userID,
        "groceryList.ingredientID": ingredientID,
      },
      {
        $set: {
          "groceryList.$.quantity": formattedQuantity,
          "groceryList.$.lastUpdated": new Date(),
        },
      },
      { new: true }
    );

    // If item wasn't found, add it as new
    if (!updateOperation) {
      const addNewItem = await User.findByIdAndUpdate(
        userID,
        {
          $push: {
            groceryList: {
              ingredientID,
              quantity: formattedQuantity,
              isPurchased: false,
              lastUpdated: new Date(),
            },
          },
        },
        { new: true }
      );

      if (!addNewItem) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "New item added to grocery list.",
        groceryList: addNewItem.groceryList,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item quantity updated in grocery list.",
      groceryList: updateOperation.groceryList,
    });
  } catch (error) {
    console.error("Error in AddtoGroceryList:", error);
    res.status(500).json({
      success: false,
      message: "Error adding item to grocery list.",
      error: error.message,
    });
  }
};

export const RemoveFromGroceryList = async (req, res) => {
  try {
    const userID = req.user._id;

    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Grocery item ID is required",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userID },
      { $pull: { groceryList: { _id: req.params.id } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from grocery list",
    });
  } catch (error) {
    console.error("Error in RemoveFromGroceryList:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing item from grocery list",
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

export const GetGroceryList = async (req, res) => {
  try {
    const userID = req.user._id;

    // Find the user and populate ingredient details
    const user = await User.findById(userID).populate({
      path: "groceryList.ingredientID",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grocery list fetched successfully.",
      groceryList: user.groceryList,
    });
  } catch (error) {
    console.error("Error in GetGroceryList:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching grocery list.",
      error: error.message,
    });
  }
};
