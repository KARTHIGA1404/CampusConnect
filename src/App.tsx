import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register'; // ✅ Import Register page
import QuestionDetails from './pages/QuestionDetails';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuestionProvider } from './contexts/QuestionContext';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} /> {/* ✅ Register route */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        {/* <Route path="/leaderboards" element={user ? <Leaderboard /> : <Navigate to="/login" />} /> */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/question/:id" element={user ? <QuestionDetails /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <QuestionProvider>
        <Router>
          <AppRoutes />
        </Router>
      </QuestionProvider>
    </AuthProvider>
  );
}

export default App;
