export default function validateRecipe(req, res, next) {
  const { name, ingredients, directions } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Missing required field: name' });
  }

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: 'Missing required field: ingredients (must be a non-empty array)' });
  }

  if (!directions || !Array.isArray(directions) || directions.length === 0) {
    return res.status(400).json({ message: 'Missing required field: directions (must be a non-empty array)' });
  }

  next();
}
