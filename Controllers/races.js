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

/**
 * Get a race by ID
 */
export const getRaceById = async (req, res) => {
  const { id } = req.params;

  try {
    const race = await Race.findById(id);
    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }
    res.status(200).json(race);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a race by ID
 */
export const updateRace = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  try {
    const updatedRace = await Race.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedRace) {
      return res.status(404).json({ message: 'Race not found' });
    }

    res.status(200).json(updatedRace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a race by ID
 */
export const deleteRace = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRace = await Race.findByIdAndDelete(id);
    if (!deletedRace) {
      return res.status(404).json({ message: 'Race not found' });
    }

    res.status(200).json({ message: 'Race deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
