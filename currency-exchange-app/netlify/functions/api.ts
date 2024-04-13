// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from 'express';
import serverless from 'serverless-http';

const api = express();
console.log('api', api);
const router = Router();
router.use('/', (req, res, next) => {
    console.log('i am inside server');
    next();
});
router.get('/hello', (req, res) => res.send('Hello World!'));

api.use('/api/', router);

export const handler = serverless(api);