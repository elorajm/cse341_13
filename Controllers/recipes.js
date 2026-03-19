// Controllers/recipes.js
import Recipe from '../models/recipe.js';

/* GET /api/recipes?page&limit&q&tag&user */
export const getAllRecipes = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.user) filter.createdBy = req.query.user;
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.q) {
      const q = req.query.q.trim();
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { 'ingredients.name': new RegExp(q, 'i') },
        { directions: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ];
    }

    const [data, total] = await Promise.all([
      Recipe.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Recipe.countDocuments(filter)
    ]);

    res.status(200).json({ data, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username email').lean();
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
  }
};

export const createRecipe = async (req, res) => {
  const {
    name, ingredients, directions, calories, taste, comment,
    prepTime, cookTime, servings, tags, imageUrl
  } = req.body;

  if (!name || !ingredients || !directions) {
    return res.status(400).json({ message: 'Missing required fields: name, ingredients, directions' });
  }

  try {
    const newRecipe = new Recipe({
      name: name.trim(),
      ingredients,
      directions,
      calories, taste, comment,
      prepTime, cookTime, servings, tags, imageUrl,
      createdBy: req.user?.id
    });

    const saved = await newRecipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create recipe', error: err.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (!req.user || recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    Object.assign(recipe, req.body);
    const updated = await recipe.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recipe', error: err.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (!req.user || recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.remove();
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
};
