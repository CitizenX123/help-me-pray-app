import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App-supabase';
import ErrorBoundary from './ErrorBoundary';
import reportWebVitals from './reportWebVitals';

console.log('Starting Help Me Pray app...');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
