import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { AuthProvider } from './store/AuthContext';
import './index.css';

// BUG FIX #8: QueryClientProvider was missing — TanStack Query hooks would throw
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        },
        mutations: { retry: 0 },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
