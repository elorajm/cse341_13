import express from 'express';
import { getAllRecipes, createRecipe } from '../Controllers/recipes.js';

const router = express.Router();
// TODO: Add recipes routes

router.get('/', getAllRecipes);

router.post('/', createRecipe);

export default router;
