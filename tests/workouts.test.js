import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../models/workout.js', () => {
  const MockWorkout = vi.fn();
  MockWorkout.find = vi.fn();
  MockWorkout.findById = vi.fn();
  MockWorkout.findByIdAndUpdate = vi.fn();
  MockWorkout.findByIdAndDelete = vi.fn();
  return { default: MockWorkout };
});

import Workout from '../models/workout.js';
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
} from '../Controllers/workouts.js';

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

describe('getAllWorkouts', () => {
  it('returns all workouts with status 200', async () => {
    const workouts = [{ name: 'Morning Run' }, { name: 'Evening Lift' }];
    Workout.find.mockResolvedValue(workouts);
    const res = mockRes();
    await getAllWorkouts(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(workouts);
  });

  it('returns 500 on database error', async () => {
    Workout.find.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await getAllWorkouts(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('getWorkoutById', () => {
  it('returns a workout with status 200', async () => {
    const workout = { _id: 'abc123', name: 'Morning Run' };
    Workout.findById.mockResolvedValue(workout);
    const res = mockRes();
    await getWorkoutById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(workout);
  });

  it('returns 404 when workout does not exist', async () => {
    Workout.findById.mockResolvedValue(null);
    const res = mockRes();
    await getWorkoutById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Workout not found' });
  });

  it('returns 500 on database error', async () => {
    Workout.findById.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await getWorkoutById(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('createWorkout', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = mockRes();
    await createWorkout(mockReq({ name: 'Run' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
  });

  it('creates a workout and returns 201', async () => {
    const body = {
      name: 'Morning Run',
      date: '2026-01-01',
      duration: 30,
      intensity: 7,
      difficulty: 'MED'
    };
    const saved = { _id: 'new-id', ...body };
    Workout.mockImplementation(function(data) {
      Object.assign(this, data);
      this.save = vi.fn().mockResolvedValue(saved);
    });
    const res = mockRes();
    await createWorkout(mockReq(body), res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(saved);
  });

  it('returns 500 on database error during save', async () => {
    const body = {
      name: 'Morning Run',
      date: '2026-01-01',
      duration: 30,
      intensity: 7,
      difficulty: 'MED'
    };
    Workout.mockImplementation(function(data) {
      Object.assign(this, data);
      this.save = vi.fn().mockRejectedValue(new Error('DB error'));
    });
    const res = mockRes();
    await createWorkout(mockReq(body), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('updateWorkout', () => {
  it('returns 404 when workout does not exist', async () => {
    Workout.findByIdAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await updateWorkout(mockReq({ name: 'Updated' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Workout not found' });
  });

  it('updates a workout and returns 200', async () => {
    const updated = { _id: 'abc123', name: 'Updated Run' };
    Workout.findByIdAndUpdate.mockResolvedValue(updated);
    const res = mockRes();
    await updateWorkout(mockReq({ name: 'Updated Run' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 500 on database error', async () => {
    Workout.findByIdAndUpdate.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await updateWorkout(mockReq({ name: 'Updated' }, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('deleteWorkout', () => {
  it('returns 404 when workout does not exist', async () => {
    Workout.findByIdAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await deleteWorkout(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Workout not found' });
  });

  it('deletes a workout and returns 200', async () => {
    Workout.findByIdAndDelete.mockResolvedValue({ _id: 'abc123', name: 'Morning Run' });
    const res = mockRes();
    await deleteWorkout(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Workout deleted successfully' });
  });

  it('returns 500 on database error', async () => {
    Workout.findByIdAndDelete.mockRejectedValue(new Error('DB error'));
    const res = mockRes();
    await deleteWorkout(mockReq({}, { id: 'abc123' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
