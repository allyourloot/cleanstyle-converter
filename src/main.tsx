
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure we find the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find root element');
}

const root = createRoot(container);

// Render the app with proper error handling
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
