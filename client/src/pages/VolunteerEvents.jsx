import React, { useState, useEffect } from "react";
import { Button, Container, Card, Row, Col, Badge } from "react-bootstrap";

const VolunteerEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchCurrentVolunteer();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/events");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const filtered = Array.isArray(data)
  ? data.filter(e =>
      e.status?.toLowerCase() !== "completed" &&
      e.status?.toLowerCase() !== "canceled"
    )
  : [];
      setEvents(filtered);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const fetchCurrentVolunteer = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    if (!token || !id) {
      console.warn("Missing token or user ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/user/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const user = await response.json();
      console.log("✅ Volunteer Profile:", user);

      setUserId(user._id);
      setUserSkills(user.skills || []);
    } catch (error) {
      console.error("Error fetching current volunteer:", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(selectedEvent?._id === event._id ? null : event);
  };

  const handleFilterChange = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSignup = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/volunteers/events/${selectedEvent._id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ volunteerId: userId }),
      });

      if (!response.ok) throw new Error("Signup failed");

      alert("Successfully signed up!");
      fetchEvents();
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed");
    }
  };

  const canSignup = (event) => {
    const hasMatchingSkill = event.requiredSkills?.some((skill) =>
      userSkills.includes(skill)
    );
    const alreadySignedUp = (event.assignedVolunteers || []).includes(userId);
    return hasMatchingSkill && !alreadySignedUp;
  };

  const getUrgencyColor = (urgency) => {
    switch ((urgency || "").toLowerCase()) {
      case "high":
        return "#931621";
      case "medium":
        return "#D9A404";
      case "low":
        return "#60993E";
      default:
        return "#4b0e0e";
    }
  };

  const filteredEvents =
    selectedSkills.length > 0
      ? events.filter(
          (event) =>
            event &&
            event.requiredSkills &&
            Array.isArray(event.requiredSkills) &&
            selectedSkills.some((skill) => event.requiredSkills.includes(skill))
        )
      : events;

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Events</h2>
      <Row className="mb-3 justify-content-center">
        {["Teamwork", "Leadership", "Communication", "Organization", "Animal Care"].map((skill) => (
          <Col xs="auto" key={skill} className="mb-2">
            <Button
              style={
                selectedSkills.includes(skill)
                  ? {
                      backgroundColor: "#60993E",
                      borderColor: "#8A95A5",
                      color: "white",
                    }
                  : {
                      backgroundColor: "white",
                      borderColor: "#8A95A5",
                      color: "#8A95A5",
                    }
              }
              className="rounded-pill px-3 py-2"
              onClick={() => handleFilterChange(skill)}
            >
              {skill}
            </Button>
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Col md={6} key={event._id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{event.location}</Card.Subtitle>
                  <Card.Text>
                    <strong>Date:</strong> {event.date.slice(0, 10)}
                  </Card.Text>
                  <div className="mb-2">
                    {event.requiredSkills?.map((skill) => (
                      <Badge bg="secondary" key={skill} className="me-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mb-2">
                    <strong>Urgency:</strong>{" "}
                    <span
                      className="badge"
                      style={{
                        backgroundColor: getUrgencyColor(event.urgency),
                        color: "white",
                        padding: "0.35em 0.65em",
                        fontSize: "0.75em",
                        borderRadius: "0.25rem",
                      }}
                    >
                      {event.urgency?.charAt(0).toUpperCase() + event.urgency?.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <Button
                    style={{
                      backgroundColor: "#2C365e",
                      borderColor: "#8A95A5",
                      color: "white",
                    }}
                    className="w-100"
                    onClick={() => handleEventClick(event)}
                  >
                    {selectedEvent?._id === event._id ? "Hide Details" : "View Details"}
                  </Button>
                  {selectedEvent?._id === event._id && (
                    <>
                      <Card.Text className="mt-2">{event.description}</Card.Text>
                      <Button
                        className="w-100 mt-2"
                        style={{
                          backgroundColor: canSignup(event) ? "#60993E" : "#A9A9A9",
                          borderColor: "#8A95A5",
                          color: "white",
                          cursor: canSignup(event) ? "pointer" : "not-allowed",
                        }}
                        disabled={!canSignup(event)}
                        onClick={() => handleSignup(event._id)}
                      >
                        {event.assignedVolunteers?.includes(userId)
                          ? "Already Signed Up"
                          : "Sign Up"}
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No events found.</p>
        )}
      </Row>
    </Container>
  );
};

export default VolunteerEvents;
