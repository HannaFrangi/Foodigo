import Category from "../models/Category.js";
import Ingredient from "../models/Ingredient.js";
import Recipe from "../models/Recipe.js";
import Area from "../models/Area.js";
import User from "../models/Users.js";

export const getStats = async (req, res) => {
  try {
    const categories = await Category.countDocuments();
    const ingredients = await Ingredient.countDocuments();
    const recipes = await Recipe.countDocuments();
    const areas = await Area.countDocuments();
    const users = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        categories: categories,
        ingredients: ingredients,
        recipes: recipes,
        areas: areas,
        users: users,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsersForTable = async (req, res) => {
  try {
    // First get total count of non-admin users
    const totalCount = await User.countDocuments({
      isAdmin: { $in: [false, null] },
    });

    // Then get the latest 5 users with their counts
    const users = await User.aggregate([
      {
        $match: {
          isAdmin: { $in: [false, null] },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          ProfilePicURL: 1,
          createdAt: 1,
          groceriesCount: {
            $size: {
              $ifNull: ["$groceryList", []],
            },
          },
          favoritesCount: {
            $size: {
              $ifNull: ["$recipeFavorites", []],
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      success: true,
      count: totalCount, // Total count of all non-admin users
      data: users, // Latest 5 users
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
