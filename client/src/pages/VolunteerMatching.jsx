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
      const response = await fetch('http://localhost:5001/api/volunteers');
      const data = await response.json();
      console.log("Fetched Volunteers:", data); 
      setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const fetchMatchedEvents = async (volunteerId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/volunteers/${volunteerId}`);
      const data = await response.json();
      console.log("Fetched Matched Events:", data.matchedEvents);
      setSelectedVolunteer(data);
    } catch (error) {
      console.error("Error fetching matched events:", error);
    }
  };

  if (!isAdmin) {
    return <p className="text-center mt-5">Access Denied. Admins Only.</p>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Volunteer Matching Form (Admin Only)</h2>

      {matchNotification && <Alert className="text-center" variant="success">{matchNotification}</Alert>}

      <h3 className="text-center mt-4">Select a Volunteer</h3>
      <Form>
        <Form.Group controlId="volunteerSelect" className="mb-3">
          <Form.Control as="select" onChange={(e) => {
            const volunteerId = parseInt(e.target.value);
            console.log("Selected Volunteer ID:", volunteerId); 
            fetchMatchedEvents(volunteerId);
          }}>
            <option value="">Select a Volunteer</option>
            {volunteers.map(volunteer => (
              <option key={volunteer.id} value={volunteer.id}>{volunteer.name}</option>
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
                      {selectedVolunteer.skills?.filter(skill => event.skills.includes(skill)).map(skill => (
                        <Badge key={skill} bg="secondary" className="me-1">{skill}</Badge>
                      ))}
                    </div>
                    <Button className="w-100 mb-2" onClick={() => setSelectedEvent(event)}>
                      View Details
                    </Button>
                    {selectedEvent?.name === event.name && (
                      <>
                        <Card.Text className="mt-2">{event.description}</Card.Text>
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