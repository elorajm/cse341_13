import { vi, describe, it, expect } from 'vitest';
import validateWorkout from '../middleware/validateWorkout.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('validateWorkout middleware', () => {
  it('calls next() when all required fields are valid', () => {
    const req = {
      body: { name: 'Morning Run', date: '2026-06-01', duration: 30, intensity: 7, difficulty: 'MED' }
    };
    const res = mockRes();
    const next = vi.fn();
    validateWorkout(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 when name is missing', () => {
    const req = { body: { date: '2026-06-01', duration: 30, intensity: 7, difficulty: 'MED' } };
    const res = mockRes();
    const next = vi.fn();
    validateWorkout(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('name') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when date is missing', () => {
    const req = { body: { name: 'Morning Run', duration: 30, intensity: 7, difficulty: 'MED' } };
    const res = mockRes();
    const next = vi.fn();
    validateWorkout(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('date') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when duration is missing', () => {
    const req = { body: { name: 'Morning Run', date: '2026-06-01', intensity: 7, difficulty: 'MED' } };
    const res = mockRes();
    const next = vi.fn();
    validateWorkout(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('duration') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when intensity is missing', () => {
    const req = { body: { name: 'Morning Run', date: '2026-06-01', duration: 30, difficulty: 'MED' } };
    const res = mockRes();
    const next = vi.fn();
    validateWorkout(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('intensity') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when difficulty is missing', () => {
    const req = { body: { name: 'Morning Run', date: '2026-06-01', duration: 30, intensity: 7 } };
    const res = mockRes();
    const next = vi.fn();
    validateWorkout(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('difficulty') })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
