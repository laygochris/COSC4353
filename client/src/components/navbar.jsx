import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./navbar.css";
import logo from "../images/ih_logo_navbar.png";
import Notifications from "../pages/Notifications";
import { CgProfile } from "react-icons/cg";

const CustomNavbar = ({ loggedIn, setLoggedIn, setUserRole }) => {
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Now stored as the ObjectId (_id)
    console.log("NAVBAR has userId:", userId);

    if (token && userId) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Fetched user data:", data);
        // Assuming your API returns the user credential details, which now include userType
        setUsername(data.username);
        setUserType(data.userType);
        setUserRole(data.userType);
        console.log("userType:", data.userType);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    } else {
      setUsername("Guest");
      setUserType("");
      setUserRole("");
    }
  }, [setUserRole]);

  useEffect(() => {
    fetchUserProfile();
  }, [loggedIn, fetchUserProfile]);

  useEffect(() => {
    console.log("Username:", username);
    console.log("UserType:", userType);
  }, [username, userType]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUsername("Guest");
    setUserType("");
    setUserRole("");
    setLoggedIn(false);
    navigate("/login");
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
            {!username || username === "Guest" ? (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            ) : (
              <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </Nav.Link>
            )}
            {userType === "admin" && (
              <Nav.Link as={Link} to="/eventManagement">
                Event Management
              </Nav.Link>
            )}
            {userType === "volunteer" && (
              <Nav.Link as={Link} to="/volunteerHistory">
                Volunteer History
              </Nav.Link>
            )}
            {userType === "admin" && (
              <Nav.Link as={Link} to="/volunteerMatchingForm">
                Volunteer Matching Form
              </Nav.Link>
            )}
            {userType === "admin" && (
              <Nav.Link as={Link} to="/admin/events">
                Events
              </Nav.Link>
            )}
            {userType === "volunteer" && (
              <Nav.Link as={Link} to="/events">
                Events
              </Nav.Link>
            )}

          </Nav>
          <Nav className="ms-auto">
            <Navbar.Text className="me-3">
              Signed in as {username || "Guest"}
            </Navbar.Text>
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
