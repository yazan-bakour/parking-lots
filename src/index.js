import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { APIContextProvider } from "./apiContext";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <APIContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </APIContextProvider>
  </React.StrictMode>
);
reportWebVitals();
