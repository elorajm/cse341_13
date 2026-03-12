import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['EASY', 'MED', 'HARD'],
  },
  repCount: Number,
  location: String,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Workout', workoutSchema);
