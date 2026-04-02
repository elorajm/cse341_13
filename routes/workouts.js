import express from 'express';
import { getAllWorkouts, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } from '../Controllers/workouts.js';
import auth from '../middleware/auth.js';
import validateWorkout from '../middleware/validateWorkout.js';

const router = express.Router();

router.get('/', (req, res) => {
  /*
    #swagger.tags = ['Workouts']
    #swagger.summary = 'Get all workouts'
    #swagger.responses[200] = { description: 'List of all workouts' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  getAllWorkouts(req, res);
});

router.post('/', auth, validateWorkout, (req, res) => {
  /*
    #swagger.tags = ['Workouts']
    #swagger.summary = 'Create a new workout'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Morning Run',
        date: '2026-03-11',
        duration: 30,
        intensity: 7,
        difficulty: 'MED',
        repCount: 0,
        location: 'City Park',
        comment: 'Felt good today'
      }
    }
    #swagger.responses[201] = { description: 'Workout created successfully' }
    #swagger.responses[400] = { description: 'Missing required fields' }
    #swagger.responses[401] = { description: 'Login required' }
  */
  createWorkout(req, res);
});

router.get('/:id', (req, res) => {
  /*
    #swagger.tags = ['Workouts']
    #swagger.summary = 'Get a workout by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Workout ID' }
    #swagger.responses[200] = { description: 'Workout found' }
    #swagger.responses[404] = { description: 'Workout not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  getWorkoutById(req, res);
});

router.put('/:id', auth, (req, res) => {
  /*
    #swagger.tags = ['Workouts']
    #swagger.summary = 'Update a workout by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Workout ID' }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Evening Run',
        date: '2026-03-11',
        duration: 45,
        intensity: 8,
        difficulty: 'HARD',
        repCount: 0,
        location: 'Track',
        comment: 'Pushed harder today'
      }
    }
    #swagger.responses[200] = { description: 'Workout updated successfully' }
    #swagger.responses[401] = { description: 'Login required' }
    #swagger.responses[404] = { description: 'Workout not found' }
  */
  updateWorkout(req, res);
});

router.delete('/:id', auth, (req, res) => {
  /*
    #swagger.tags = ['Workouts']
    #swagger.summary = 'Delete a workout by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Workout ID' }
    #swagger.responses[200] = { description: 'Workout deleted successfully' }
    #swagger.responses[401] = { description: 'Login required' }
    #swagger.responses[404] = { description: 'Workout not found' }
  */
  deleteWorkout(req, res);
});

export default router;
