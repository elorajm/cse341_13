import express from 'express';
import { getAllWorkouts, createWorkout } from '../Controllers/workouts.js';
const router = express.Router();
/**
 * GET /api/workouts
 * #swagger.tags = ['Workouts']
 * #swagger.summary = 'Get all workouts'
 * #swagger.responses[200] = { description: 'List of all workouts' }
 */
router.get('/', getAllWorkouts);
/**
 * POST /api/workouts
 * #swagger.tags = ['Workouts']
 * #swagger.summary = 'Create a new workout'
 * #swagger.parameters['body'] = {
 *   in: 'body',
 *   required: true,
 *   schema: {
 *     name: 'Morning Run',
 *     date: '2026-03-11',
 *     duration: 30,
 *     intensity: 7,
 *     difficulty: 'MED',
 *     repCount: 0,
 *     location: 'City Park',
 *     comment: 'Felt good today'
 *   }
 * }
 * #swagger.responses[201] = { description: 'Workout created successfully' }
 * #swagger.responses[400] = { description: 'Missing required fields' }
 */
router.post('/', createWorkout);
export default router;
