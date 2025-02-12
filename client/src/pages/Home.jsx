import React from "react";
import houston from "../images/downtown_houston.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="position-relative vh-100">
      <img 
        src={houston} 
        alt="Downtown Houston" 
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
      />
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50 text-center">
        <h1 className="text-white display-4 fw-bold">Welcome to Impact Houston</h1>
        <p className="text-white fs-4 mt-3">Making a Difference Through Volunteering</p>
      </div>
    </div>
  );
};

export default Home;
