import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EventManagement from './pages/EventManagement';
import Home from './pages/Home';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import VolunteerHistory from './pages/VolunteerHistory';
import VolunteerMatching from './pages/VolunteerMatching';
import Events from './pages/Events';
import VolunteerEvents from './pages/VolunteerEvents';

function App() {
  const [userRole, setUserRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Router>
      <div className="App">
        <CustomNavbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUserRole={setUserRole} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/eventManagement" element={<EventManagement />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUserRole={setUserRole} />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/volunteerHistory" element={<VolunteerHistory />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/events" element={<VolunteerEvents />} />
          <Route
            path="/volunteerMatchingForm"
            element={userRole === "admin" ? <VolunteerMatching userRole={userRole} /> : <Navigate to="/home" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;