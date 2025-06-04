import React, { useState, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './pages/auth/signup';
import Navbar from './components/navbar';
import AddDailyBudgetPages from './pages/add-daily-budget';
import BudgetAddSavingPage from './pages/budget-and-saving';
import DashboardPage from './pages/dashboard';
import UserPage from './pages/user';
import LogIn from './pages/auth/login';

import './index.css';
import reportWebVitals from './reportWebVitals';


export const AuthContext = createContext();

const Layout = ({ user }) => {
  return (
    <div className="h-screen">
      <Outlet />
      {user && <Navbar />}
    </div>
  );
};

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="login" />;
};

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Khôi phục user từ localStorage khi app khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Route path="/" element={<Layout user={user} />}>
  {/* Public */}
  <Route path="/login" element={<LogIn />} />
  <Route path="/signup" element={<SignUp />} />

  {/* Redirect root to login or dashboard */}
  <Route
    index
    element={
      user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
    }
  />

  {/* Private routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute user={user}>
        <DashboardPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/user"
    element={
      <ProtectedRoute user={user}>
        <UserPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/add-daily-budget"
    element={
      <ProtectedRoute user={user}>
        <AddDailyBudgetPages />
      </ProtectedRoute>
    }
  />
  <Route
    path="/budget-and-saving"
    element={
      <ProtectedRoute user={user}>
        <BudgetAddSavingPage />
      </ProtectedRoute>
    }
  />
</Route>

      </BrowserRouter>
    </AuthContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
