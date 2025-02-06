import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import EventManagement from '.pages/EventManagement';
//import Home from './pages/Home';
import Login from './pages/Login';



function App() {
  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <h1>Volunteering Website</h1>

        <Routes>
          <Route path="/login" element={<Login/>} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
