import Recipe from '../models/recipe.js';
/**
* Get all recipes
*/
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
* Create a new recipe
*/
export const createRecipe = async (req, res) => {
  const { name, date, ingredients, directions, calories, taste, comment } = req.body;

  // Validation
  if (!name || !date || !ingredients || !directions ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newRecipe = new Recipe({
      name,
      date,
      ingredients,
      directions,
      calories,
      taste,
      comment,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
