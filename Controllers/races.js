import Race from '../models/race.js';

/**
 * Get all races
 */
export const getAllRaces = async (req, res) => {
  try {
    const races = await Race.find();
    res.status(200).json(races);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new race
 */
export const createRace = async (req, res) => {
  const { name, date, location, distance, description } = req.body;

  // Validation
  if (!name || !date || !location || !distance) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newRace = new Race({
      name,
      date,
      location,
      distance,
      description,
    });

    const savedRace = await newRace.save();
    res.status(201).json(savedRace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
