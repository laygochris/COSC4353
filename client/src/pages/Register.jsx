import React, { useState } from "react";
import "./Register.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering: ", { firstName, lastName });
    navigate("/home");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
      console.log("Welcome: ", { firstName, lastName, username });
      navigate("/home");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <Container className="register-container">
      <Row className="justify-content-center">
        <Card className="register-card">
          <Card.Body>
            <h2 className="register-title">Register</h2>
            <form onSubmit={handleRegister} className="register-form">
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
                    value={username}
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
