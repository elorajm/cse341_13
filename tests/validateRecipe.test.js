import { vi, describe, it, expect } from 'vitest';
import validateRecipe from '../middleware/validateRecipe.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('validateRecipe middleware', () => {
  it('calls next() when all required fields are valid', () => {
    const req = {
      body: {
        name: 'Tacos',
        ingredients: [{ name: 'Tortillas', amount: '8' }],
        directions: ['Cook beef', 'Assemble']
      }
    };
    const res = mockRes();
    const next = vi.fn();
    validateRecipe(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 when name is missing', () => {
    const req = {
      body: {
        ingredients: [{ name: 'Tortillas', amount: '8' }],
        directions: ['Cook beef']
      }
    };
    const res = mockRes();
    const next = vi.fn();
    validateRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('name') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when ingredients is missing', () => {
    const req = {
      body: {
        name: 'Tacos',
        directions: ['Cook beef']
      }
    };
    const res = mockRes();
    const next = vi.fn();
    validateRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('ingredients') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when ingredients is an empty array', () => {
    const req = {
      body: {
        name: 'Tacos',
        ingredients: [],
        directions: ['Cook beef']
      }
    };
    const res = mockRes();
    const next = vi.fn();
    validateRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when directions is missing', () => {
    const req = {
      body: {
        name: 'Tacos',
        ingredients: [{ name: 'Tortillas', amount: '8' }]
      }
    };
    const res = mockRes();
    const next = vi.fn();
    validateRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('directions') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when directions is an empty array', () => {
    const req = {
      body: {
        name: 'Tacos',
        ingredients: [{ name: 'Tortillas', amount: '8' }],
        directions: []
      }
    };
    const res = mockRes();
    const next = vi.fn();
    validateRecipe(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
