import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../images/ih_logo_navbar.png";
import Notifications from "../pages/Notifications";
import { CgProfile } from "react-icons/cg";

const CustomNavbar = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/user");
      const data = await response.json();
      setUserName(data.fullName || "Guest");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          <img src={logo} alt="Impact Houston" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/eventManagement">
              Event Management
            </Nav.Link>
            <Nav.Link as={Link} to="/volunteerHistory">
              Volunteer History
            </Nav.Link>
            <Nav.Link as={Link} to="/volunteerMatchingForm">
              Volunteer Matching Form
            </Nav.Link>
            <Nav.Link as={Link} to="/events">
              Events
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Navbar.Text className="me-3">Signed in as {userName || "Guest"}</Navbar.Text>
            <Nav.Link as={Link} to="/userProfile">
              <CgProfile size={25} />
            </Nav.Link>
            <Notifications />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
