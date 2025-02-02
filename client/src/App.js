import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar';
import CustomNavbar from './components/navbar';


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
