import { vi, describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';

vi.mock('../models/recipe.js', () => {
  const MockRecipe = vi.fn();
  MockRecipe.find = vi.fn();
  MockRecipe.findById = vi.fn();
  MockRecipe.create = vi.fn();
  MockRecipe.findByIdAndUpdate = vi.fn();
  MockRecipe.findByIdAndDelete = vi.fn();
  return { default: MockRecipe };
});

import Recipe from '../models/recipe.js';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from '../Controllers/recipes.js';

const mockReq = (body = {}, params = {}) => ({ body, params });
const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

// Set MONGODB_URI so the controller uses the real DB path (not the mock in-memory fallback)
beforeAll(() => {
  process.env.MONGODB_URI = 'mongodb://test';
});

afterAll(() => {
  delete process.env.MONGODB_URI;
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getAllRecipes', () => {
  it('returns all recipes with status 200', async () => {
    const recipes = [{ name: 'Pasta' }, { name: 'Tacos' }];
    Recipe.find.mockResolvedValue(recipes);
    const res = mockRes();
    await getAllRecipes(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recipes);
  });

  it('returns 500 on database error', async () => {
    Recipe.find.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await getAllRecipes(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('getRecipeById', () => {
  it('returns a recipe with status 200', async () => {
    const recipe = { _id: 'abc123', name: 'Pasta' };
    Recipe.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(recipe) });
    const res = mockRes();
    await getRecipeById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recipe);
  });

  it('returns 404 when recipe does not exist', async () => {
    Recipe.findById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) });
    const res = mockRes();
    await getRecipeById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
  });

  it('returns 500 on database error', async () => {
    Recipe.findById.mockReturnValue({ lean: vi.fn().mockRejectedValue(new Error('DB error')) });
    const res = mockRes();
    await getRecipeById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('createRecipe', () => {
  it('creates a recipe and returns 201', async () => {
    const body = {
      name: 'Tacos',
      ingredients: [{ name: 'Tortillas', amount: '8' }],
      directions: ['Cook beef', 'Assemble']
    };
    const created = { _id: 'new-id', ...body };
    Recipe.create.mockResolvedValue(created);
    const res = mockRes();
    await createRecipe(mockReq(body), res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it('returns 400 on validation error', async () => {
    Recipe.create.mockRejectedValue(new Error('Validation failed: name is required'));
    const res = mockRes();
    await createRecipe(mockReq({}), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Failed to create recipe' })
    );
  });
});

describe('updateRecipe', () => {
  it('updates a recipe and returns 200', async () => {
    const updated = { _id: 'abc123', name: 'Updated Tacos' };
    Recipe.findByIdAndUpdate.mockResolvedValue(updated);
    const res = mockRes();
    await updateRecipe(mockReq({ name: 'Updated Tacos' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 404 when recipe does not exist', async () => {
    Recipe.findByIdAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await updateRecipe(mockReq({ name: 'New' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
  });

  it('returns 400 on validation error', async () => {
    Recipe.findByIdAndUpdate.mockRejectedValue(new Error('Validation error'));
    const res = mockRes();
    await updateRecipe(mockReq({ name: 'New' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('deleteRecipe', () => {
  it('deletes a recipe and returns 200', async () => {
    const deleted = { _id: 'abc123', name: 'Pasta' };
    Recipe.findByIdAndDelete.mockResolvedValue(deleted);
    const res = mockRes();
    await deleteRecipe(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(deleted);
  });

  it('returns 404 when recipe does not exist', async () => {
    Recipe.findByIdAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await deleteRecipe(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
  });

  it('returns 500 on database error', async () => {
    Recipe.findByIdAndDelete.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await deleteRecipe(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
