import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'CSE 341 Team 13 API',
    description: 'API for managing races, recipes, and workouts',
    version: '1.0.0',
    contact: {
      name: 'Team 13',
    },
  },
  host: 'localhost:3000',
  basePath: '/api',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

const outputFile = './swagger.json';
const routes = [
  './routes/index.js',
  './routes/races.js',
  './routes/recipes.js',
  './routes/workouts.js',
];

swaggerAutogen()(outputFile, routes, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});
