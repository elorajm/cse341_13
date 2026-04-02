import express from 'express';
import { getAllRaces, createRace, getRaceById, updateRace, deleteRace } from '../Controllers/races.js';
import auth from '../middleware/auth.js';
import validateRace from '../middleware/validateRace.js';

const router = express.Router();

router.get('/', (req, res) => {
  /*
    #swagger.tags = ['Races']
    #swagger.summary = 'Get all races'
    #swagger.responses[200] = { description: 'List of all races' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  getAllRaces(req, res);
});

router.post('/', auth, validateRace, (req, res) => {
  /*
    #swagger.tags = ['Races']
    #swagger.summary = 'Create a new race'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Sample Race',
        date: '2026-03-15',
        location: 'Salt Lake City',
        distance: 5,
        description: 'A fun 5k race'
      }
    }
    #swagger.responses[201] = { description: 'Race created successfully' }
    #swagger.responses[400] = { description: 'Missing required fields' }
    #swagger.responses[401] = { description: 'Login required' }
  */
  createRace(req, res);
});

router.get('/:id', (req, res) => {
  /*
    #swagger.tags = ['Races']
    #swagger.summary = 'Get a race by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Race ID' }
    #swagger.responses[200] = { description: 'Race found' }
    #swagger.responses[404] = { description: 'Race not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  getRaceById(req, res);
});

router.put('/:id', auth, (req, res) => {
  /*
    #swagger.tags = ['Races']
    #swagger.summary = 'Update a race by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Race ID' }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Updated Race Name',
        date: '2026-03-20',
        location: 'New Location',
        distance: 10,
        description: 'Updated description'
      }
    }
    #swagger.responses[200] = { description: 'Race updated successfully' }
    #swagger.responses[400] = { description: 'No fields provided to update' }
    #swagger.responses[401] = { description: 'Login required' }
    #swagger.responses[404] = { description: 'Race not found' }
  */
  updateRace(req, res);
});

router.delete('/:id', auth, (req, res) => {
  /*
    #swagger.tags = ['Races']
    #swagger.summary = 'Delete a race by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Race ID' }
    #swagger.responses[200] = { description: 'Race deleted successfully' }
    #swagger.responses[401] = { description: 'Login required' }
    #swagger.responses[404] = { description: 'Race not found' }
  */
  deleteRace(req, res);
});

export default router;
