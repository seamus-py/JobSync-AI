import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Tracker from './pages/Tracker.jsx';
import ResumeMatch from './pages/ResumeMatch.jsx';
import AddJob from './pages/AddJob.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<App />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/match" element={<ResumeMatch />} />
        <Route path ="/add" element={<AddJob />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);