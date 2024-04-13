import React, {useState} from 'react';
import useCurrencyRates from '../store/useCurrencyRates'; // Importing custom hook to fetch currency rates
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import styled from 'styled-components';
import {TableBody, TableHead, TableRow, Table} from "@mui/material";

// Styled components
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Title = styled.h1`
  font-size: 26px;
  text-align: center;
  margin-bottom: 20px;
`;

const Heading = styled.h2`
  font-size: 20px;
  text-align: left;
  margin-bottom: 5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid ${props => props.onInvalid ? 'red' : '#ccc'}; /* Change border color for invalid input */
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
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    cursor: not-allowed;
    background-color: #cccccc;
    color: #666666;
    }
  }
`;

const ConversionResult = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5; /* light grey background */
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* shadow for depth */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AmountText = styled.span`
  font-size: 18px;
`;

const ConversionText = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const CurrencyConverter: React.FC = () => {
    /* using our backend */
    const {data, isLoading} = useCurrencyRates();

    /* amount displayed in form */
    const [amountToConvert, setAmountToConvert] = useState('');

    /* amount that will be converted */
    const [amount, setAmount] = useState('');

    /* currency that will be converted */
    const [currency, setCurrency] = useState('');

    /* currency selected */
    const [selectedCurrency, setSelectedCurrency] = useState('AUD');

    /* amount displayed to the user */
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

    /* validating input text form */
    const [validInput, setValidInput] = useState(false);

    if (isLoading) return <div>Loading data...</div>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amountToConvert || !selectedCurrency || !data) return; // if this data is not provided, do not convert
        setAmount(amountToConvert); // store amount so that the result does not change based on the input
        setCurrency(selectedCurrency); // store currency so that does not change on input again
        const splitData = data.split('\n').map(line => line.split('|'));
        const selectedRate = splitData.find(row => row[3] === selectedCurrency);
        if (!selectedRate) return "Currency Not Found";
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
            <Form onSubmit={handleSubmit}>
                <Input type="text" value={amountToConvert} onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d*\.?\d*$/.test(input)) { // allow only numbers with optional decimal point
                        setAmountToConvert(input);
                        setValidInput(true);
                    }
                }}
                       placeholder="Enter amount in CZK"
                />
                <Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                    {data?.split('\n').slice(2, -1).map(line => { // remove first two rows and the last row from data
                        const [, , , code,] = line.split('|');
                        return <option key={code}>{code}</option>; // display only code in form
                    })}
                </Select>
                <Button type="submit" disabled={!validInput}>Convert</Button>
            </Form>
            {convertedAmount !== null && (
                <ConversionResult>
                    <AmountText>{amount} CZK </AmountText>
                    <ConversionText>= {convertedAmount.toFixed(2)} {currency}</ConversionText>
                </ConversionResult>
            )}
            <Heading>Current Rates:</Heading>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                fontWeight: '600', /* add nice formatting for the table */
                                fontSize: '1rem',
                                padding: '8px',
                                borderBottom: '3px solid rgba(224, 224, 224, 1)',
                                borderTop: '3px solid rgba(224, 224, 224, 1)'
                            }}>Currency</TableCell>
                            <TableCell sx={{
                                fontWeight: '600',
                                fontSize: '1rem',
                                padding: '8px',
                                borderBottom: '3px solid rgba(224, 224, 224, 1)',
                                borderTop: '3px solid rgba(224, 224, 224, 1)'
                            }}>Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.split('\n').slice(2, -1).map(line => {
                            const [country, currency, currencyAmount, code, CZKAmount] = line.split('|');
                            return (
                                <TableRow key={code} sx={{
                                    '&: last-child td, &: last-child th': {border: 0}, // last child does not have a border
                                    '&:nth-of-type(odd)': {backgroundColor: 'white'},
                                    '&:nth-of-type(even)': {backgroundColor: '#f2f2f2'}, // change background color every other row
                                }}>
                                    <TableCell
                                        sx={{padding: '8px'}}>{country} {capitalize(currency)} ({code})</TableCell>
                                    <TableCell
                                        sx={{padding: '8px'}}>{currencyAmount} {code} = {CZKAmount} CZK </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default CurrencyConverter;

