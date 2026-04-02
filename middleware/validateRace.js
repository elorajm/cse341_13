export default function validateRace(req, res, next) {
  const { name, date, location, distance } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Missing required field: name' });
  }

  if (!date) {
    return res.status(400).json({ message: 'Missing required field: date' });
  }

  if (!location || typeof location !== 'string' || location.trim() === '') {
    return res.status(400).json({ message: 'Missing required field: location' });
  }

  if (distance === undefined || distance === null || distance === '') {
    return res.status(400).json({ message: 'Missing required field: distance' });
  }

  next();
}
