import React from 'react';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



function App() {
  return (
    <div className="App">
      <header id = "Navbar"> 
         <CustomNavbar/>
      </header>
      <h1>Volunteering Website</h1>
    </div>
  );
}

export default App;
