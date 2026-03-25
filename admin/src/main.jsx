import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { LangProvider } from './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <LangProvider>
                <App />
            </LangProvider>
            <Toaster position="top-right" toastOptions={{
                style: { background: '#1A1A22', color: '#F5F5F5', border: '1px solid #2A2A35', borderRadius: '12px' },
                success: { iconTheme: { primary: '#d6b068', secondary: '#0B0B0D' } },
                error: { iconTheme: { primary: '#E74C3C', secondary: '#0B0B0D' } }
            }} />
        </BrowserRouter>
    </React.StrictMode>
)
