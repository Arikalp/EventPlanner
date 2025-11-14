/**
 * Application Entry Point
 * Initializes the Event Planning Assistant React application
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import EventPlannerApp from './App.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Please ensure index.html contains a div with id="root"');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <EventPlannerApp />
  </StrictMode>
);
