
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Find the root element and render the app
try {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(container);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('App successfully mounted');
} catch (error) {
  console.error('Failed to mount app:', error);
  
  // Add a fallback rendering in case of errors
  const errorContainer = document.createElement('div');
  errorContainer.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Something went wrong</h2>
      <p>The application failed to initialize. Please try refreshing the page.</p>
      <p style="color: red;">Error: ${error instanceof Error ? error.message : String(error)}</p>
    </div>
  `;
  document.body.appendChild(errorContainer);
}
