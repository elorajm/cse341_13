import express from 'express';
import { getAllRaces, createRace } from '../Controllers/races.js';

const router = express.Router();

/**
 * GET /api/races
 * #swagger.tags = ['Races']
 * #swagger.summary = 'Get all races'
 * #swagger.responses[200] = { description: 'List of all races' }
 */
router.get('/', getAllRaces);

/**
 * POST /api/races
 * #swagger.tags = ['Races']
 * #swagger.summary = 'Create a new race'
 * #swagger.parameters['body'] = {
 *   in: 'body',
 *   required: true,
 *   schema: {
 *     name: 'Sample Race',
 *     date: '2026-03-15',
 *     location: 'Salt Lake City',
 *     distance: 5,
 *     description: 'A fun 5k race'
 *   }
 * }
 * #swagger.responses[201] = { description: 'Race created successfully' }
 * #swagger.responses[400] = { description: 'Missing required fields' }
 */
router.post('/', createRace);

export default router;
