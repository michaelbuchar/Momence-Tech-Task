import {useQuery} from 'react-query';

const fetchCurrencyRates = async () => {
    let headers = new Headers();
    const response = await fetch('https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt', // use backend server
        {headers: headers});
    return await response.text();
};

const useCurrencyRates = () => {
    return useQuery('currencyRates', fetchCurrencyRates);
};

export default useCurrencyRates;