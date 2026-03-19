import Workout from '../models/workout.js';
/**
 * Get all workouts
 */
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Get a workout by ID
 */
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Update a workout by ID
 */
export const updateWorkout = async (req, res) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Delete a workout by ID
 */
export const deleteWorkout = async (req, res) => {
  try {
    const deleted = await Workout.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Create a new workout
 */
export const createWorkout = async (req, res) => {
  const { name, date, duration, intensity, difficulty, repCount, location, comment } = req.body;

  if (!name || !date || !duration || !intensity || !difficulty) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newWorkout = new Workout({
      name,
      date,
      duration,
      intensity,
      difficulty,
      repCount,
      location,
      comment,
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
