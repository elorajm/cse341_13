import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../models/race.js', () => {
  const MockRace = vi.fn();
  MockRace.find = vi.fn();
  MockRace.findById = vi.fn();
  MockRace.findByIdAndUpdate = vi.fn();
  MockRace.findByIdAndDelete = vi.fn();
  return { default: MockRace };
});

import Race from '../models/race.js';
import {
  getAllRaces,
  getRaceById,
  createRace,
  updateRace,
  deleteRace
} from '../Controllers/races.js';

const mockReq = (body = {}, params = {}) => ({ body, params });
const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getAllRaces', () => {
  it('returns all races with status 200', async () => {
    const races = [{ name: 'Race 1' }, { name: 'Race 2' }];
    Race.find.mockResolvedValue(races);
    const res = mockRes();
    await getAllRaces(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(races);
  });

  it('returns 500 on database error', async () => {
    Race.find.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await getAllRaces(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('getRaceById', () => {
  it('returns a race with status 200', async () => {
    const race = { _id: 'abc123', name: 'Race 1' };
    Race.findById.mockResolvedValue(race);
    const res = mockRes();
    await getRaceById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(race);
  });

  it('returns 404 when race does not exist', async () => {
    Race.findById.mockResolvedValue(null);
    const res = mockRes();
    await getRaceById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Race not found' });
  });

  it('returns 500 on database error', async () => {
    Race.findById.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await getRaceById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('createRace', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = mockRes();
    await createRace(mockReq({ name: 'Race' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
  });

  it('creates a race and returns 201', async () => {
    const body = { name: 'Race', date: '2026-01-01', location: 'City', distance: 5 };
    const saved = { _id: 'new-id', ...body };
    Race.mockImplementation(function(data) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(saved);
    });
    const res = mockRes();
    await createRace(mockReq(body), res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(saved);
  });

  it('returns 500 on database error during save', async () => {
    const body = { name: 'Race', date: '2026-01-01', location: 'City', distance: 5 };
    Race.mockImplementation(function(data) {
      Object.assign(this, data);
      this.save = vi.fn().mockRejectedValue(new Error('DB error'));
    });
    const res = mockRes();
    await createRace(mockReq(body), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('updateRace', () => {
  it('returns 400 when request body is empty', async () => {
    const res = mockRes();
    await updateRace(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No fields provided to update' });
  });

  it('returns 404 when race does not exist', async () => {
    Race.findByIdAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await updateRace(mockReq({ name: 'Updated' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Race not found' });
  });

  it('updates a race and returns 200', async () => {
    const updated = { _id: 'abc123', name: 'Updated Race' };
    Race.findByIdAndUpdate.mockResolvedValue(updated);
    const res = mockRes();
    await updateRace(mockReq({ name: 'Updated Race' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 500 on database error', async () => {
    Race.findByIdAndUpdate.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await updateRace(mockReq({ name: 'Updated' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('deleteRace', () => {
  it('returns 404 when race does not exist', async () => {
    Race.findByIdAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await deleteRace(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Race not found' });
  });

  it('deletes a race and returns 200', async () => {
    Race.findByIdAndDelete.mockResolvedValue({ _id: 'abc123', name: 'Race' });
    const res = mockRes();
    await deleteRace(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Race deleted successfully' });
  });

  it('returns 500 on database error', async () => {
    Race.findByIdAndDelete.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await deleteRace(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
