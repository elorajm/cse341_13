import express from 'express';
import racesRoutes from './races.js';
import recipesRoutes from './recipes.js';
import workoutsRoutes from './workouts.js';

const router = express.Router();

router.use('/races', racesRoutes);
router.use('/recipes', recipesRoutes);
router.use('/workouts', workoutsRoutes);

export default router;
