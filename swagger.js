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
  host: 'cse341-13.onrender.com',
  basePath: '/',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

const outputFile = './swagger.json';
const routes = [
  './server.js',
];

swaggerAutogen()(outputFile, routes, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});
