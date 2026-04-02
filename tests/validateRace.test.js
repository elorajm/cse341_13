import { vi, describe, it, expect } from 'vitest';
import validateRace from '../middleware/validateRace.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('validateRace middleware', () => {
  it('calls next() when all required fields are valid', () => {
    const req = { body: { name: 'City 5k', date: '2026-06-01', location: 'Downtown', distance: 5 } };
    const res = mockRes();
    const next = vi.fn();
    validateRace(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 when name is missing', () => {
    const req = { body: { date: '2026-06-01', location: 'Downtown', distance: 5 } };
    const res = mockRes();
    const next = vi.fn();
    validateRace(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('name') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when date is missing', () => {
    const req = { body: { name: 'City 5k', location: 'Downtown', distance: 5 } };
    const res = mockRes();
    const next = vi.fn();
    validateRace(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('date') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when location is missing', () => {
    const req = { body: { name: 'City 5k', date: '2026-06-01', distance: 5 } };
    const res = mockRes();
    const next = vi.fn();
    validateRace(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('location') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when distance is missing', () => {
    const req = { body: { name: 'City 5k', date: '2026-06-01', location: 'Downtown' } };
    const res = mockRes();
    const next = vi.fn();
    validateRace(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('distance') })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
