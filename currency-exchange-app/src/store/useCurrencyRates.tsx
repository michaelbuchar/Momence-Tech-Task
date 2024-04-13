import {useQuery} from 'react-query';

const fetchCurrencyRates = async () => {
    let headers = new Headers();
    const response = await fetch('https://sprightly-kitsune-ab6903.netlify.app/api/currency-rates', // use backend server
        {headers: headers});
    return await response.text();
};

const useCurrencyRates = () => {
    return useQuery('currencyRates', fetchCurrencyRates);
};

export default useCurrencyRates;