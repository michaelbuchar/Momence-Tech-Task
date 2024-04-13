import React, {useState} from 'react';
import useCurrencyRates from '../store/useCurrencyRates'; // importing custom hook to fetch currency rates
import TableContainer from '@mui/material/TableContainer'
import styled from 'styled-components';

// styled components
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const CurrencyList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CurrencyItem = styled.li`
  margin-top: 10px;
  border-bottom: dashed;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  padding: 8px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ConvertedAmount = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const CurrencyConverter: React.FC = () => {
    const {data, isLoading} = useCurrencyRates(); // using our backend
    const [amountToConvert, setAmountToConvert] = useState(''); // amount displayed in form
    const [amount, setAmount] = useState(''); // amount that will be converted
    const [currency, setCurrency] = useState(''); // currency that will be converted
    const [selectedCurrency, setSelectedCurrency] = useState('AUD'); // currency selected //TODO
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null); // amount displayed to the user
    console.log(selectedCurrency);

    if (isLoading) return <div>Loading data...</div>; // loading page for user experience

    const handleSubmit = (e: React.FormEvent) => { // handling of submit button
        e.preventDefault();
        if (!amountToConvert || !selectedCurrency || !data) return; // if this data is not provided, do not convert
        setAmount(amountToConvert); // store amount so that the result does not change based on the input
        setCurrency(selectedCurrency); // store currency so that does not change on input again
        const splitData = data.split('\n').map(line => line.split('|'));
        const selectedRate = splitData.find(row => row[3] === selectedCurrency);
        if (!selectedRate) return "Currency Not Found"; // basic error handling - could not find currency
        const rate = parseFloat(selectedRate[4]) / parseFloat(selectedRate[2]); // compute rate = foreign currency rate / CZK rate
        const converted = parseFloat(amountToConvert) / rate;
        setConvertedAmount(converted);
    };

    function capitalize(s: string) { // function to capitalize every first word of a sentence to make the table look nicer
        let strings = s.split(' ');
        for (let i = 0; i < strings.length; i++) {
            strings[i] = strings[i].charAt(0).toUpperCase() + strings[i].substring(1);
        }
        return strings.join(' ');
    }

    return (
        <Container>
            <Title>Currency Converter</Title>
            <TableContainer>
                <CurrencyList>
                    {data?.split('\n').slice(2, -1).map(line => { // display table with currencies - remove first 2 lines and last line
                        const [country, currency, currencyAmount, code, CZKAmount] = line.split('|');
                        return <CurrencyItem key={code}>{country} {capitalize(currency)} ({code}): {CZKAmount} CZK
                            = {currencyAmount} {code}</CurrencyItem>;
                    })}
                </CurrencyList>
            </TableContainer>
            <Form onSubmit={handleSubmit}>
                <Input type="text" value={amountToConvert} onChange={(e) => setAmountToConvert(e.target.value)}
                       placeholder="Enter amount in CZK"/>
                <Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                    {data?.split('\n').slice(2, -1).map(line => { // display only code in form
                        const [, , , code,] = line.split('|');
                        return <option key={code}>{code}</option>;
                    })}
                </Select>
                <Button type="submit">Convert</Button>
            </Form>
            {convertedAmount !== null && (
                <ConvertedAmount>
                    {amount} CZK is equal to {convertedAmount.toFixed(2)} {currency}
                </ConvertedAmount>
            )}
        </Container>
    );
};

export default CurrencyConverter;

