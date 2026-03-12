import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  directions: {
    type: String,
    required: true,
  },
  calories: {
    type: String,
  },
  taste: {
    type: String,
  }, 
  comment: {
    type: String,
  },
});

export default mongoose.model('Recipe', recipeSchema);
