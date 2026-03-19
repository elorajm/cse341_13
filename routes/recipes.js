import express from 'express';
import { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from '../Controllers/recipes.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', auth, createRecipe);
router.put('/:id', auth, updateRecipe);
router.delete('/:id', auth, deleteRecipe);

// optional premium route
// router.post('/ai/generate', auth, premium, generateAIRecipe);

export default router;
