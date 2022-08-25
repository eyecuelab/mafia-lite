import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={
           <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        }/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
