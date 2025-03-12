
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find root element');
}

const root = createRoot(container);

// Ensure app renders in StrictMode and with proper error boundaries
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

