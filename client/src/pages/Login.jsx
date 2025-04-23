import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const Login = ({ setLoggedIn, setUserRole, setUserID, setNotifications }) => {
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
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      setLoggedIn(true);
      setUserRole(user.userType);
      setUserID(user._id); // use _id instead of id

      // ✅ Fetch notifications and update immediately
      const res = await fetch(`http://localhost:5001/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notifs = await res.json();
      console.log("User's notifications:", notifs);
      //  setNotifications(notifs); // ✅ Fix: after fetching

      console.log("Redirecting to /home...");
      navigate("/home");
      window.location.reload();
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
