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
      console.log("Fetching volunteers from backend...");
      const response = await fetch("http://localhost:5001/api/volunteers");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      console.log("Received data from API:", data);
      
      // Ensure that data contains the necessary fields and update the state
      if (Array.isArray(data)) {
        setVolunteers(data);  // Set the volunteers data into state
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
      console.log(`Fetching matched events for volunteer ID: ${volunteerId}`);
      const response = await fetch(`http://localhost:5001/api/volunteers/match/${volunteerId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      console.log("Fetched Matched Events:", data);
      setSelectedVolunteer({ ...data, name: `${data.volunteer?.firstName || ''} ${data.volunteer?.lastName || ''}` });
    } catch (error) {
      console.error("Error fetching matched events:", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  const handleMatchNotification = (volunteerName, eventName) => {
    setMatchNotification(`${volunteerName} has been matched with ${eventName}.`);
    setTimeout(() => setMatchNotification(null), 2000);
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
            const volunteerId = e.target.value;  // Use MongoDB _id as value
            console.log("Selected Volunteer ID:", volunteerId);

            if (!volunteerId) {
              console.error("Invalid volunteerId detected:", volunteerId);
              return;
            }

            fetchMatchedEvents(volunteerId);  // Fetch matched events based on volunteer _id
          }}
        >
          <option value="">Select a Volunteer</option>
          {volunteers.map(volunteer => (
            <option key={volunteer._id} value={volunteer._id}> {/* Use MongoDB _id as value */}
              {volunteer.fullName} {/* Display the full name */}
            </option>
          ))}
        </Form.Control>
        </Form.Group>

        {selectedVolunteer?.matchedEvents?.length > 0 ? (
          <Row className="justify-content-center">
            {selectedVolunteer.matchedEvents.map((event, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{event.location}</Card.Subtitle>
                    <Card.Text>
                      <strong>Date:</strong> {event.date}
                    </Card.Text>
                    <div className="mb-2">
                      <strong>Matched Skills: </strong>
                      {event.matchedSkills && event.matchedSkills.length > 0 ? (
                        event.matchedSkills.map((skill) => (
                          <Badge key={skill} bg="success" className="me-1">{skill}</Badge>
                        ))
                      ) : (
                        <Badge bg="danger">No Matched Skills</Badge>
                      )}
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
                    {selectedEvent?.name === event.name && (
                      <>
                        <Card.Text className="mt-2">{event.description}</Card.Text>
                        <Button className="w-100 mt-2" style={{ backgroundColor: '#60993E', borderColor: '#8A95A5', color: 'white' }} onClick={() => {
                          handleMatchNotification(selectedVolunteer.name, event.name);
                        }}>Match</Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No matched events found for this volunteer.</p>
        )}
      </Form>
    </Container>
  );
};

export default VolunteerMatching;
