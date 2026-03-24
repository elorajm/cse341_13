import express from 'express';
import { getAllRaces, createRace, getRaceById, updateRace, deleteRace } from '../Controllers/races.js';
import auth from '../middleware/auth.js';

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
router.post('/', auth, createRace);

/**
 * GET /api/races/{id}
 * #swagger.tags = ['Races']
 * #swagger.summary = 'Get a race by ID'
 * #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Race ID' }
 * #swagger.responses[200] = { description: 'Race found' }
 * #swagger.responses[404] = { description: 'Race not found' }
 */
router.get('/:id', getRaceById);

/**
 * PUT /api/races/{id}
 * #swagger.tags = ['Races']
 * #swagger.summary = 'Update a race by ID'
 * #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Race ID' }
 * #swagger.parameters['body'] = {
 *   in: 'body',
 *   required: true,
 *   schema: {
 *     name: 'Updated Race Name',
 *     date: '2026-03-20',
 *     location: 'New Location',
 *     distance: 10,
 *     description: 'Updated description'
 *   }
 * }
 * #swagger.responses[200] = { description: 'Race updated successfully' }
 * #swagger.responses[400] = { description: 'No fields provided to update' }
 * #swagger.responses[404] = { description: 'Race not found' }
 */
router.put('/:id', auth, updateRace);

/**
 * DELETE /api/races/{id}
 * #swagger.tags = ['Races']
 * #swagger.summary = 'Delete a race by ID'
 * #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Race ID' }
 * #swagger.responses[200] = { description: 'Race deleted successfully' }
 * #swagger.responses[404] = { description: 'Race not found' }
 */
router.delete('/:id', auth, deleteRace);

export default router;
