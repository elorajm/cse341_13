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
