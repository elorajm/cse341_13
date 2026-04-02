import express from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from '../Controllers/recipes.js';
import auth from '../middleware/auth.js';
import validateRecipe from '../middleware/validateRecipe.js';

const router = express.Router();

router.get('/__test', (req, res) => {
  res.send('recipes router is alive');
});

router.get('/', (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Get all recipes'
    #swagger.responses[200] = { description: 'List of all recipes' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  getAllRecipes(req, res);
});

router.get('/:id', (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Get a recipe by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Recipe ID' }
    #swagger.responses[200] = { description: 'Recipe found' }
    #swagger.responses[404] = { description: 'Recipe not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  getRecipeById(req, res);
});

router.post('/', auth, validateRecipe, (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Create a new recipe'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Tacos',
        ingredients: [
          { name: 'Tortillas', amount: '8' },
          { name: 'Ground Beef', amount: '1 lb' },
          { name: 'Cheese', amount: '1 cup' }
        ],
        directions: ['Brown the beef', 'Warm the tortillas', 'Assemble and serve'],
        calories: '450',
        taste: 'Savory',
        comment: 'Quick weeknight dinner',
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        tags: ['mexican', 'dinner'],
        imageUrl: 'https://example.com/tacos.jpg'
      }
    }
    #swagger.responses[201] = { description: 'Recipe created successfully' }
    #swagger.responses[400] = { description: 'Validation error or missing required fields' }
    #swagger.responses[401] = { description: 'Login required' }
  */
  createRecipe(req, res);
});

router.put('/:id', auth, (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Update a recipe by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Recipe ID' }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Updated Tacos',
        calories: '500',
        servings: 6,
        comment: 'Updated with extra cheese'
      }
    }
    #swagger.responses[200] = { description: 'Recipe updated successfully' }
    #swagger.responses[400] = { description: 'Validation error' }
    #swagger.responses[401] = { description: 'Login required' }
    #swagger.responses[404] = { description: 'Recipe not found' }
  */
  updateRecipe(req, res);
});

router.delete('/:id', auth, (req, res) => {
  /*
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Delete a recipe by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Recipe ID' }
    #swagger.responses[200] = { description: 'Recipe deleted successfully' }
    #swagger.responses[401] = { description: 'Login required' }
    #swagger.responses[404] = { description: 'Recipe not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  deleteRecipe(req, res);
});

export default router;
