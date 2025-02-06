import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const CustomNavbar = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Navbar</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/eventManagement">Event Management</Nav.Link>
                        <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>
                        <Nav.Link as={Link} to="/userProfile">Profile</Nav.Link>
                        <Nav.Link as={Link} to="/volunteerHistory">Volunteer History</Nav.Link>
                        <Nav.Link as={Link} to="/volunteer">Volunteer</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/action1">Action</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/action2">Another action</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/action3">Something else here</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/action4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar; 
