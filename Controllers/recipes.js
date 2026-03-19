// Controllers/recipes.js
import Recipe from '../models/recipe.js';

/* GET all recipes */
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
  }
};

/* GET recipe by ID */
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
  }
};

/* POST create recipe */
export const createRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const saved = await newRecipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create recipe', error: err.message });
  }
};

/* PUT update recipe */
export const updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recipe', error: err.message });
  }
};

/* DELETE recipe */
export const deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
};
