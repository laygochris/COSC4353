import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventManagement from './pages/EventManagement';
import Home from './pages/Home';
import Login from './pages/Login';
import Notifications from './pages/Notifcations';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import VolunteerHistory from './pages/VolunteerHistory';
import VolunteerMatching from './pages/VolunteerMatching';


function App() {
  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <h1>Volunteering Website</h1>

        <Routes>
          <Route path="/eventManagement" element={<EventManagement/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/userProfile" element={<UserProfile/>} />
          <Route path="/volunteerHistory" element={<VolunteerHistory/>} />
          <Route path="/volunteer" element={<VolunteerMatching/>} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
