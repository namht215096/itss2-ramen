import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import Navbar from '../src/components/navbar';
import AddDailyBudgetPages from '../src/pages/add-daily-budget';
import BudgetAddSavingPage from '../src/pages/budget-and-saving';
import DashboardPage from '../src/pages/dashboard';

import './index.css';
import reportWebVitals from './reportWebVitals';

const Layout = () => {
  return (
    <div className=" h-screen">
      <Outlet></Outlet>
      <Navbar></Navbar>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes element>
        <Route path="/" element={<Layout></Layout>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-daily-budget" element={<AddDailyBudgetPages />} />
          <Route path="/budget-and-saving" element={<BudgetAddSavingPage />} />
          <Route path="/sign-up" element={<div />} />
          <Route path="/sign-in" element={<div />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
