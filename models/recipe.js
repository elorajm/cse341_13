// models/recipe.js
import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ingredients: { type: [ingredientSchema], required: true },
  directions: { type: [String], required: true },
  calories: { type: String },
  taste: { type: String },
  comment: { type: String },
  prepTime: { type: Number },
  cookTime: { type: Number },
  servings: { type: Number },
  tags: { type: [String] },
  imageUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);
