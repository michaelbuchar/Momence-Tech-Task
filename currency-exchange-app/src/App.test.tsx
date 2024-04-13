import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import App from './App';

describe('CurrencyConverter component', () => {
    /* Renders without crashing test */
    it('renders without crashing', () => {
        render(<App/>);
    });

    /* Displays loading page */
    it('displays loading message when data is loading', () => {
        const {getByText} = render(<App/>);
        expect(getByText('Loading data...')).toBeInTheDocument();
    });

    /* Displays data */
    it('displays currency rates when data is loaded', async () => {
        const {getByText} = render(<App/>);
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });
    });

    /* Converts 100 CZK to USD correctly using the current rate */
    it('converts amount correctly USD (bigger rate than CZK)', async () => {
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        // Simulate data loading
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });

        // Input handling
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        fireEvent.change(inputAmount, {target: {value: '100'}});

        // Selecting a currency
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'USD'}});

        // Converting...
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);

        // Check if conversion result is displayed
        const result = '4.20';
        await waitFor(() => {
            expect(getByText(`100 CZK`)).toBeInTheDocument();
            expect(getByText(`= ${result} USD`)).toBeInTheDocument();
        });
    });

    /* Converts 73.569 CZK to TRY correctly according to current rate */
    it('converts amount correctly TRY (smaller rate than CZK)', async () => {
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        const input = '73.569';
        fireEvent.change(inputAmount, {target: {value: `${input}`}});
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'TRY'}});
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);
        const result = '100.00';
        await waitFor(() => {
            expect(getByText(`${input} CZK`)).toBeInTheDocument();
            expect(getByText(`= ${result} TRY`)).toBeInTheDocument();
        });
    });

    /* Input validation - Testing conversion of negative amounts */
    it('does not convert negative amount', async () => {
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        const input = '-15.427';
        fireEvent.change(inputAmount, {target: {value: `${input}`}});
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'AUD'}});
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);

        // Check  conversion did not happen
        await waitFor(() => {
            expect(() => getByText(`${input} CZK`))
                .toThrow(`Unable to find an element with the text: ${input} CZK. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`);
        });
    });

    /* Input validation - Testing conversion of string instead of a number */
    it('does not convert a non-number', async () => {
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        const input = 'string';
        fireEvent.change(inputAmount, {target: {value: `${input}`}});
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'AUD'}});
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);

        // Check  conversion did not happen
        await waitFor(() => {
            expect(() => getByText(`${input} CZK`))
                .toThrow(`Unable to find an element with the text: ${input} CZK. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`);
        });
    });
});

