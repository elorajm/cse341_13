import mongoose from 'mongoose';
import Recipe from '../models/recipe.js';

/* Local Testing Mock Recipes */
const mockRecipes = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Spaghetti Bolognese',
    ingredients: [
      { name: 'Spaghetti', amount: '200g' },
      { name: 'Ground Beef', amount: '300g' },
      { name: 'Tomato Sauce', amount: '1 cup' }
    ],
    directions: [
      'Boil spaghetti until al dente',
      'Cook beef until browned',
      'Add sauce and simmer',
      'Combine with pasta'
    ],
    calories: '650',
    taste: 'Savory',
    comment: 'Family favorite',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    tags: ['italian', 'pasta'],
    imageUrl: 'https://example.com/spaghetti.jpg',
    createdBy: new mongoose.Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/* GET all recipes */
export const getAllRecipes = async (req, res) => {
  if (!process.env.MONGODB_URI) {
    return res.status(200).json(mockRecipes);
  }

  try {
    const recipes = await Recipe.find();
    return res.status(200).json(recipes);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

/* GET recipe by ID */
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    return res.status(200).json(recipe);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch recipe' });
  }
};

/* POST create recipe */

/* POST create recipe */
export const createRecipe = async (req, res) => {
  // Local dev mode (no DB)
  if (!process.env.MONGODB_URI) {
    const newRecipe = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      createdBy: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockRecipes.push(newRecipe);
    return res.status(201).json(newRecipe);
  }

  // Production / MongoDB mode
  try {
    // Inject required field BEFORE validation
    req.body.createdBy = new mongoose.Types.ObjectId();

    const recipe = await Recipe.create(req.body);
    return res.status(201).json(recipe);
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to create recipe',
      error: err.message
    });
  }
};


/* PUT update recipe */
export const updateRecipe = async (req, res) => {
  const { id } = req.params;

  if (!process.env.MONGODB_URI) {
    const index = mockRecipes.findIndex(r => r._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    mockRecipes[index] = {
      ...mockRecipes[index],
      ...req.body,
      updatedAt: new Date()
    };

    return res.status(200).json(mockRecipes[index]);
  }

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    return res.status(200).json(updatedRecipe);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/* DELETE recipe */
export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  if (!process.env.MONGODB_URI) {
    const index = mockRecipes.findIndex(r => r._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const deleted = mockRecipes.splice(index, 1)[0];
    return res.status(200).json(deleted);
  }

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    return res.status(200).json(deletedRecipe);
  } catch {
    return res.status(500).json({ message: 'Failed to delete recipe' });
  }
};
