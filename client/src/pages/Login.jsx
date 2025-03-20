import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const Login = ({ setLoggedIn, setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("User not found or invalid credentials");
      }

      const data = await response.json();
      setMessage(data.message);

      if (data.token) {
        console.log("HELLO FROM TOKEN");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        setLoggedIn(true);
        setUserRole(data.user.userType); // Update userRole state
      }

      // console.log("Logging in with:", { email, password });
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
    }
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
