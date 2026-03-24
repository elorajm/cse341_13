import express from 'express';
import { getAllWorkouts, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } from '../Controllers/workouts.js';
import auth from '../middleware/auth.js';
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
router.post('/', auth, createWorkout);
/**
 * GET /api/workouts/:id
 * #swagger.tags = ['Workouts']
 * #swagger.summary = 'Get a workout by ID'
 * #swagger.responses[200] = { description: 'Workout found' }
 * #swagger.responses[404] = { description: 'Workout not found' }
 */
router.get('/:id', getWorkoutById);
/**
 * PUT /api/workouts/:id
 * #swagger.tags = ['Workouts']
 * #swagger.summary = 'Update a workout by ID'
 * #swagger.parameters['body'] = {
 *   in: 'body',
 *   required: true,
 *   schema: {
 *     name: 'Evening Run',
 *     date: '2026-03-11',
 *     duration: 45,
 *     intensity: 8,
 *     difficulty: 'HARD',
 *     repCount: 0,
 *     location: 'Track',
 *     comment: 'Pushed harder today'
 *   }
 * }
 * #swagger.responses[200] = { description: 'Workout updated successfully' }
 * #swagger.responses[404] = { description: 'Workout not found' }
 */
router.put('/:id', auth, updateWorkout);
/**
 * DELETE /api/workouts/:id
 * #swagger.tags = ['Workouts']
 * #swagger.summary = 'Delete a workout by ID'
 * #swagger.responses[200] = { description: 'Workout deleted successfully' }
 * #swagger.responses[404] = { description: 'Workout not found' }
 */
router.delete('/:id', auth, deleteWorkout);
export default router;
