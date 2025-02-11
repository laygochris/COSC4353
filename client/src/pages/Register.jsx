import React, { useState } from "react";
import "./Register.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering: ", { firstName, lastName });
    navigate("/home");
  };

  return (
    <Container className="register-container">
      <Row className="justify-content-center">
        <Card className="register-card">
          <Card.Body>
            <h2 className="register-title">Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
              {/* Name Fields */}
              <Row className="input-row">
                <p className="input-descriptor">Name</p>
                <Col md={6}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Col>
                <Col md={6}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {/* Username Field */}
              <Row className="input-row">
                <Col md={12}>
                  <p className="input-descriptor">Username</p>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    col
                    md={6}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {/* Email Field */}
              <Row className="input-row">
                <Col md={12}>
                  <p className="input-descriptor">Email</p>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    col
                    md={6}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="input-row">
                <Col md={12}>
                  <p className="input-descriptor">Password</p>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    col
                    md={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="input-row">
                <p className="input-descriptor"></p>
                <Col md={12}>
                  <Button type="submit" className="register-button">
                    Register
                  </Button>
                </Col>
              </Row>
            </form>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default Register;
