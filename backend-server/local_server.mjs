import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;
const URL = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'

app.use(cors()); // To get around the CORS issue in the frontend

app.get('/currency-rates', async (req, res) => {
    try {
        const response = await fetch(URL); // Forwards URL
        const data = await response.text();
        res.send(data);
    } catch (error) { // Some basic error handling
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // For my information
});