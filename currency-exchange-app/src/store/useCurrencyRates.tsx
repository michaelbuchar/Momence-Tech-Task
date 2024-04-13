import {useQuery} from 'react-query';

const fetchCurrencyRates = async () => {
    let headers = new Headers();
    const response = await fetch('http://localhost:5001/currency-rates', // use backend server
        {headers: headers});
    return await response.text();
};

const useCurrencyRates = () => {
    return useQuery('currencyRates', fetchCurrencyRates);
};

export default useCurrencyRates;