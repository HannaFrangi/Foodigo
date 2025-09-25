import express from 'express';
import {
  createRecipe,
  getRecipeById,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  addReview,
  deleteReview,
  editReview,
  getLatestRecipe,
  getRandomRecipe,
  getRecipesByName,
  getRecipesByCategory,
  getRecipesByArea,
  getRecipesByAreaName,
  getRecipesByIngredients,
  getRecipesByIngredientsId,
  getReviewsByRecipeId,
  get12RandomRecipes,
} from '../controllers/recipeControllers.js';
import { protectRoute } from '../middleware/auth.js';
import multer from 'multer';
import { cacheMiddleware } from '../config/cache.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

router.post('/', protectRoute, upload.single('recipeImage'), createRecipe);
router.get('/latest', cacheMiddleware(1800), getLatestRecipe);
router.get('/:id/review', getReviewsByRecipeId);
router.get('/search', getRecipesByName);
router.get('/12randomrecipes', cacheMiddleware(1800), get12RandomRecipes);
router.get('/category/:categoryId', getRecipesByCategory);
router.get('/random', getRandomRecipe);
router.get('/search_ingredient', getRecipesByIngredients);
router.get('/search_ingredient_id', getRecipesByIngredientsId);
router.get('/:id', cacheMiddleware(1800), getRecipeById);
router.get('/', cacheMiddleware(1800), getAllRecipes);
router.get('/area/:areaId', cacheMiddleware(1800), getRecipesByArea);
router.get('/area/name/:areaName', cacheMiddleware(1800), getRecipesByAreaName);
router.put('/:id', protectRoute, updateRecipe);
router.delete('/:id', protectRoute, deleteRecipe);
router.post('/:id/review', protectRoute, addReview);
router.delete('/:id/review', protectRoute, deleteReview);
router.put('/:id/review', protectRoute, editReview);

export default router;
