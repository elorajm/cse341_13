export default function validateWorkout(req, res, next) {
  const { name, date, duration, intensity, difficulty } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Missing required field: name' });
  }

  if (!date) {
    return res.status(400).json({ message: 'Missing required field: date' });
  }

  if (duration === undefined || duration === null || duration === '') {
    return res.status(400).json({ message: 'Missing required field: duration' });
  }

  if (intensity === undefined || intensity === null || intensity === '') {
    return res.status(400).json({ message: 'Missing required field: intensity' });
  }

  if (!difficulty || typeof difficulty !== 'string' || difficulty.trim() === '') {
    return res.status(400).json({ message: 'Missing required field: difficulty' });
  }

  next();
}
