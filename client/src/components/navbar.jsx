import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { CgProfile } from "react-icons/cg";
import logo from "../images/ih_logo_navbar.png";
import Notifications from "../pages/Notifications";
import "./navbar.css";

const CustomNavbar = ({
  loggedIn,
  setLoggedIn,
  setUserRole,
  notifications,
  setNotifications,
}) => {
  const [username, setUsername] = useState("Guest");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ✅ Fetch user profile
  const fetchUserProfile = async () => {
    if (!userId || !token) return;

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
      setUsername(data.username || "Guest");
      setUserType(data.userType || "");
      setUserRole(data.userType || "");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    if (!userId || !token) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/notifications/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (loggedIn && userId) {
      fetchUserProfile();
      fetchNotifications();
    } else {
      setUsername("Guest");
      setUserType("");
      setUserRole("");
    }
  }, [loggedIn, userId]);

  // ✅ Real-time socket connection
  useEffect(() => {
    if (!loggedIn || !userId) return;

    const socket = io("http://localhost:5001");

    socket.on("notificationAssigned", (data) => {
      if (data.userID === userId) {
        setNotifications((prev) => [...prev, data]);
      }
    });

    return () => socket.disconnect();
  }, [loggedIn, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUsername("Guest");
    setUserType("");
    setUserRole("");
    setLoggedIn(false);
    setNotifications([]);
    navigate("/login");
    window.location.reload();
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
            {!loggedIn ? (
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
            <Navbar.Text className="me-3">Signed in as {username}</Navbar.Text>
            <Nav.Link as={Link} to="/userProfile">
              <CgProfile size={25} />
            </Nav.Link>
            <Notifications notifications={notifications || []} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
