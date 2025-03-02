import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // sending a post request to specified URL
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST", // specify that is a POST request
        headers: {
          // set Content-Type to application/json, indicating
          // that the request body contains JSON data
          "Content-Type": "application/json",
        },
        // converts email and pasword to JSON string and includes it in request body
        body: JSON.stringify({ email, password }),
      });
      // after "trying" wait for backend to respond and display message
      const data = await response.json();
      setMessage(data.message);
      console.log("Logging in with:", { email, password });
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    navigate("/home"); // Redirect after login
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={5}>
          <Card className="login-card">
            <Card.Body>
              <h2 className="login-title">Login</h2>
              <div className="sign-up-link">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Register Now</Link>
                </p>
              </div>
              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="forgot-password-link">
                  <p>
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </p>
                </div>

                <Button type="submit" className="login-button">
                  Login
                </Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
