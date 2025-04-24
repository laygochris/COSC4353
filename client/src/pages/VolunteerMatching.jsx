import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Row, Col, Badge, Form, Alert } from 'react-bootstrap';

const VolunteerMatching = ({ userRole }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matchNotification, setMatchNotification] = useState(null);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(null);

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/home');
    } else {
      setIsAdmin(true);
      fetchVolunteers();
    }
  }, [userRole, navigate]);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/volunteers");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setVolunteers(data);
      } else {
        console.error("Fetched data is not in the expected format", data);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const fetchMatchedEvents = async (volunteerId) => {
    if (!volunteerId) {
      console.error("Invalid volunteerId detected:", volunteerId);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5001/api/volunteers/match/${volunteerId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
  
      console.log("💡 Raw API Response:", data);
      console.log("💡 Volunteer object from backend:", data.volunteer);
      console.log("💡 Volunteer ID:", data.volunteer?._id);
  
      if (!data.volunteer?._id) {
        console.error("❌ No _id found in volunteer object!");
      }
  
      setSelectedVolunteer({
        _id: data.volunteer._id, // ✅ explicitly assign
        name: `${data.volunteer?.firstName || ''} ${data.volunteer?.lastName || ''}`,
        skills: data.volunteer?.skills || [],
        matchedEvents: data.matchedEvents,
      });
    } catch (error) {
      console.error("Error fetching matched events:", error);
    }
  };  

  const handleEventClick = (event) => {
    setSelectedEvent(selectedEvent?._id === event._id ? null : event);
  };

  const handleMatchNotification = (volunteerName, eventName) => {
    setMatchNotification(`${volunteerName} has been matched with ${eventName}.`);
    setTimeout(() => setMatchNotification(null), 2000);
  };

  const matchVolunteerToEvent = async () => {
    if (!selectedVolunteerId || !selectedEvent?._id) {
      console.error("Missing volunteer or event ID");
      console.log("Volunteer ID:", selectedVolunteerId);
      console.log("Event ID:", selectedEvent?._id);
      return;
    }
  
    console.log("Matching volunteer:", selectedVolunteerId, "to event:", selectedEvent._id);
  
    try {
      const response = await fetch(`http://localhost:5001/api/volunteers/events/${selectedEvent._id}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId: selectedVolunteerId }), // ✅ use the selected ID directly
      });
  
      if (!response.ok) throw new Error('Failed to match volunteer');
      handleMatchNotification(selectedVolunteer.name, selectedEvent.name);
    } catch (error) {
      console.error('Match Error:', error);
    }
  };  

  if (!isAdmin) {
    return <p className="text-center mt-5">Access Denied. Admins Only.</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Volunteer Matching Form</h2>
      {matchNotification && <Alert variant="success" className="text-center">{matchNotification}</Alert>}
      <h3 className="text-center mt-4">Select a Volunteer</h3>
      <Form>
        <Form.Group controlId="volunteerSelect" className="mb-3">
        <Form.Control
          as="select"
          onChange={(e) => {
            const volunteerId = e.target.value;
            setSelectedVolunteerId(volunteerId); // ✅ Save the ID directly

            if (!volunteerId) return;
            fetchMatchedEvents(volunteerId);
          }}
        >
            <option value="">Select a Volunteer</option>
            {volunteers.map(volunteer => (
              <option key={volunteer._id} value={volunteer._id}>
                {volunteer.fullName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {selectedVolunteer?.matchedEvents?.length > 0 ? (
          <Row className="justify-content-center">
            {selectedVolunteer.matchedEvents.map((event, index) => {
              const isAlreadyMatched = event.assignedVolunteers?.includes(selectedVolunteerId);

              return (
                <Col md={6} key={index} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{event.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{event.location}</Card.Subtitle>
                      <Card.Text>
                        <strong>Date:</strong> {new Date(event.date).toISOString().slice(0, 10)}
                      </Card.Text>
                      <div className="mb-2">
                        <strong>Matched Skills: </strong>
                        {event.matchedSkills?.length > 0 ? (
                          event.matchedSkills.map((skill) => (
                            <Badge key={skill} bg="secondary" className="me-1">{skill}</Badge>
                          ))
                        ) : (
                          <Badge bg="danger">No Matched Skills</Badge>
                        )}
                      </div>
                      <Button
                        style={{ backgroundColor: "#2C365e", borderColor: "#8A95A5", color: "white" }}
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
                              backgroundColor: isAlreadyMatched ? '#A9A9A9' : '#60993E',
                              borderColor: '#8A95A5',
                              color: 'white',
                              cursor: isAlreadyMatched ? 'not-allowed' : 'pointer',
                            }}
                            disabled={isAlreadyMatched}
                            onClick={!isAlreadyMatched ? matchVolunteerToEvent : null}
                          >
                            {isAlreadyMatched ? 'Already Matched' : 'Match'}
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className="text-center">No matched events found for this volunteer.</p>
        )}

      </Form>
    </Container>
  );
};

export default VolunteerMatching;