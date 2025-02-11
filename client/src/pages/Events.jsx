import React, { useState } from "react";
import { Button, Container, Card, Row, Col, Badge } from "react-bootstrap";

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Community Cleanup",
      skills: ["Teamwork", "Leadership"],
      description: "Join us in cleaning up the coastline to protect marine life.",
      location: "Galveston, TX",
      date: "08/16/24",
      time: "10:00 AM - 2:00 PM",
    },
    {
      id: 2,
      name: "Food Bank Assistance",
      skills: ["Communication", "Organization"],
      description: "Help distribute food to families in need.",
      location: "Houston Food Bank",
      date: "07/20/24",
      time: "9:00 AM - 12:00 PM",
    },
    {
      id: 3,
      name: "Tutoring Program",
      skills: ["Communication"],
      description: "Assist students with academic subjects in a tutoring program.",
      location: "Pearland, TX",
      date: "10/28/24",
      time: "2:00 PM - 5:00 PM",
    },
    {
      id: 4,
      name: "Animal Shelter Help",
      skills: ["Animal Care"],
      description: "Assist in caring for rescued animals.",
      location: "Sugar Land, TX",
      date: "12/05/24",
      time: "11:00 AM - 3:00 PM",
    },
  ]);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  const handleFilterChange = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const filteredEvents =
    selectedSkills.length > 0
      ? events.filter((event) =>
          selectedSkills.some((skill) => event.skills.includes(skill))
        )
      : events;

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Volunteer Matching</h2>
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
        {filteredEvents.map((event) => (
          <Col md={6} key={event.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{event.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {event.location}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Date:</strong> {event.date} <br />
                  <strong>Time:</strong> {event.time}
                </Card.Text>
                <div className="mb-2">
                  {event.skills.map((skill) => (
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
                  {selectedEvent?.id === event.id ? "Hide Details" : "View Details"}
                </Button>
                {selectedEvent?.id === event.id && (
                  <Card.Text className="mt-2">{event.description}</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;
