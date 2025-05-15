import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import DashboardPage from '../src/pages/dashboard';
import LandingPage from '../src/pages/landingPage';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/add-daily-budget" element={<div />} />
        <Route path="/budget-and-saving" element={<div />} />
        <Route path="/sign-up" element={<div />} />
        <Route path="/sign-in" element={<div />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
