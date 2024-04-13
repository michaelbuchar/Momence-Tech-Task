import React from 'react';
import CurrencyForm from "./pages/CurrencyForm";
import {QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <CurrencyForm/>
            </div>
        </QueryClientProvider>
    );
}

export default App;