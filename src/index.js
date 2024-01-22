import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { APIContextProvider } from "./api/apiContext";
import './index.css';
import App from './App';

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
