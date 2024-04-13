import express, { Router } from 'express';
import serverless from 'serverless-http';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const router = Router();
const URL = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'

app.use(cors()); // To get around the CORS issue in the frontend

router.get('/currency-rates', async (req, res) => {
    try {
        const response = await fetch(URL); // forwards URL
        const data = await response.text();
        res.send(data);
    } catch (error) { // Some basic error handling
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.use('/api/', router);

export const handler = serverless(app);

