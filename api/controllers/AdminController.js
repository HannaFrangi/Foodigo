import Category from '../models/Category.js';
import Ingredient from '../models/Ingredient.js';
import Recipe from '../models/Recipe.js';
import Area from '../models/Area.js';
import User from '../models/Users.js';

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
//stats
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
              $ifNull: ['$groceryList', []],
            },
          },
          favoritesCount: {
            $size: {
              $ifNull: ['$recipeFavorites', []],
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

export const modifyUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    const updates = req.body;

    // Verify that the requester is an admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required',
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent modifying other admin accounts
    if (user.isAdmin && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify other admin accounts',
      });
    }

    // List of fields that can be modified
    const allowedUpdates = [
      'name',
      'email',
      'isVerified',
      'isActive',
      'ProfilePicURL',
    ];

    // Filter out any unauthorized field updates
    const sanitizedUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // Special handling for password updates
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      sanitizedUpdates.password = await bcrypt.hash(updates.password, salt);
    }

    // Special handling for email updates
    if (updates.email) {
      // Check if email is already in use by another user
      const existingUser = await User.findOne({
        email: updates.email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
      sanitizedUpdates.email = updates.email.toLowerCase();
    }

    // Perform the update with validation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: sanitizedUpdates,
      },
      {
        new: true,
        runValidators: true,
        select: '-password', // Exclude password from response
      }
    );

    return res.status(200).json({
      success: true,
      message: 'User account updated successfully',
      data: {
        user: updatedUser,
        modifiedFields: Object.keys(sanitizedUpdates),
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    // Generic error handler
    return res.status(500).json({
      success: false,
      message: 'Error modifying user account',
      error: error.message,
    });
  }
};
// USers Table
export const getAllUsersX = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $in: [false, null] } })
      .sort({ createdAt: -1 }); // 
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};


export const NewestRecipesX = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('Fetching latest recipes...');

    const [latestRecipes, total] = await Promise.all([
      Recipe.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name ProfilePicURL'),
      Recipe.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: latestRecipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching latest recipes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve the latest recipes due to server error',
    });
  }
};

export const getRecipesByNameX = async (req, res) => {
  const searchTerm = req.query.recipeTitle;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a search term.',
    });
  }

  try {
    const [recipes, total] = await Promise.all([
      Recipe.find({
        recipeTitle: { $regex: new RegExp(searchTerm, 'i') },
      })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name ProfilePicURL'),
      Recipe.countDocuments({
        recipeTitle: { $regex: new RegExp(searchTerm, 'i') },
      }),
    ]);

    if (recipes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No recipes found with that name.',
      });
    }

    return res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Error searching for recipes by name:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search for recipes due to server error',
    });
  }
};
