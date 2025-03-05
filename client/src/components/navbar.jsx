import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../images/ih_logo_navbar.png";
import Notifications from "../pages/Notifications";
import { CgProfile } from "react-icons/cg";

const CustomNavbar = ({ loggedIn, setLoggedIn, setUserRole }) => {
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, [loggedIn]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("HELLO FROM THE NAVBAR");
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
        setUsername(data.username);
        setUserType(data.userType);
        setUserRole(data.userType);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    } else {
      setUsername("Guest");
      setUserType("");
      setUserRole(""); // Reset userRole state
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUsername("Guest");
    setUserType("");
    setUserRole(""); // Reset userRole state
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
            <Nav.Link as={Link} to="/events">
              Events
            </Nav.Link>
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
