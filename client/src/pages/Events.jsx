import React, { useState, useEffect } from "react";
import { Button, Container, Card, Row, Col, Badge } from "react-bootstrap";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/events");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleEventClick = (event) => {
    // Toggle event details based on _id
    setSelectedEvent(selectedEvent?._id === event._id ? null : event);
  };

  const handleFilterChange = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Remove event from local state (UI only)
  const removeEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
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
          filteredEvents.map(
            (event) =>
              event && (
                <Col md={6} key={event._id} className="mb-3">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <span>{event.name}</span>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => removeEvent(event._id)}
                        style={{ fontWeight: "bold", lineHeight: 1 }}
                      >
                        ×
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">
                        {event.location}
                      </Card.Subtitle>
                      <Card.Text>
                        <strong>Date:</strong> {event.date.slice(0, 10)}
                      </Card.Text>
                      <div className="mb-2">
                        {event.requiredSkills &&
                          Array.isArray(event.requiredSkills) &&
                          event.requiredSkills.map((skill) => (
                            <Badge bg="secondary" key={skill} className="me-1">
                              {skill}
                            </Badge>
                          ))}
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
                        <Card.Text className="mt-2">{event.description}</Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )
          )
        ) : (
          <p className="text-center">No events found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Events;
