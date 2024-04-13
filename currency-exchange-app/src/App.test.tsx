import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import App from './App';

describe('CurrencyConverter component', () => {
    // Renders without crashing test
    it('renders without crashing', () => {
        render(<App/>);
    });

    // Displays loading page
    it('displays loading message when data is loading', () => {
        const {getByText} = render(<App/>);
        expect(getByText('Loading data...')).toBeInTheDocument();
    });

    // Displays data
    it('displays currency rates when data is loaded', async () => {
        const {getByText} = render(<App/>);
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });
    });

    it('converts amount correctly USD (bigger rate than CZK)', async () => { // converts 100 CZK to USD correctly
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        // Simulate data loading
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });

        // Fill in amount to convert
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        fireEvent.change(inputAmount, {target: {value: '100'}});

        // Select a currency
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'USD'}});

        // Click convert button
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);

        // Check if conversion result is displayed
        const result = '4.20';
        await waitFor(() => {
            expect(getByText(`100 CZK`)).toBeInTheDocument();
            expect(getByText(`= ${result} USD`)).toBeInTheDocument();
        });
    });

    it('converts amount correctly TRY (smaller rate than CZK)', async () => { // converts 73.569 CZK to TRY correctly
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        // Simulate data loading
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });

        // Fill in amount to convert
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        const input = '73.569';
        fireEvent.change(inputAmount, {target: {value: `${input}`}});

        // Select a currency
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'TRY'}});

        // Click convert button
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);

        // Check if conversion result is displayed
        const result = '100.00';
        await waitFor(() => {
            expect(getByText(`${input} CZK`)).toBeInTheDocument();
            expect(getByText(`= ${result} TRY`)).toBeInTheDocument();
        });
    });

    it('does not convert negative amount', async () => {
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        // Simulate data loading
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });

        // Fill in amount to convert
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        const input = '-15.427';
        fireEvent.change(inputAmount, {target: {value: `${input}`}});

        // Select a currency
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'AUD'}});

        // Click convert button
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);

        // Check if conversion did not happen
        await waitFor(() => {
            expect(() => getByText(`${input} CZK`))
                .toThrow(`Unable to find an element with the text: ${input} CZK. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`);
        });
    });

    it('does not convert a non-number', async () => {
        const {getByText, getByPlaceholderText, getByRole} = render(<App/>);
        // Simulate data loading
        await waitFor(() => {
            expect(getByText('AUD')).toBeInTheDocument();
        });

        // Fill in amount to convert
        const inputAmount = getByPlaceholderText('Enter amount in CZK');
        const input = 'string';
        fireEvent.change(inputAmount, {target: {value: `${input}`}});

        // Select a currency
        const selectCurrency = getByRole('combobox');
        fireEvent.change(selectCurrency, {target: {value: 'AUD'}});

        // Click convert button
        const convertButton = getByText('Convert');
        fireEvent.click(convertButton);

        // Check if conversion did not happen
        await waitFor(() => {
            expect(() => getByText(`${input} CZK`))
                .toThrow(`Unable to find an element with the text: ${input} CZK. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`);
        });
    });
});

