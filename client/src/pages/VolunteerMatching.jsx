import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Card, Row, Col, Badge, Form, Alert } from 'react-bootstrap';

const VolunteerMatching = ({ userRole }) => {
  const navigate = useNavigate();
  
  const [isAdmin, setIsAdmin] = useState(userRole === 'admin'); 
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      skills: ["Teamwork", "Leadership"],
      matchedEvents: [
        {
          name: "Community Cleanup",
          location: "Galveston, TX",
          date: "08/16/24",
          time: "10:00 AM - 2:00 PM",
          skills: ["Teamwork", "Leadership"],
          description: "Join us in cleaning up the coastline to protect marine life.",
        },
        {
          name: "Beach Cleanup",
          location: "Santa Monica Beach",
          date: "04/10/24",
          time: "9:00 AM - 1:00 PM",
          skills: ["Teamwork"],
          description: "Help us remove trash and protect marine life at Santa Monica Beach.",
        },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      skills: ["Communication", "Organization"],
      matchedEvents: [
        {
          name: "Food Bank Assistance",
          location: "Houston Food Bank",
          date: "07/20/24",
          time: "9:00 AM - 12:00 PM",
          skills: ["Communication", "Organization"],
          description: "Help distribute food to families in need.",
        },
        {
          name: "Tutoring Program",
          location: "Pearland, TX",
          date: "10/28/24",
          time: "2:00 PM - 5:00 PM",
          skills: ["Communication"],
          description: "Assist students with academic subjects in a tutoring program.",
        },
      ],
    },
  ]);

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matchNotification, setMatchNotification] = useState(null);
  const [searchSkill, setSearchSkill] = useState('');
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home'); 
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleSkillSearch = () => {
    const matchingVolunteers = volunteers.filter(v => v.skills.includes(searchSkill));
    setFilteredVolunteers(matchingVolunteers);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Volunteer Matching Form (Admin Only)</h2>

      {matchNotification && <Alert style={{ backgroundColor: '#deeed5', borderColor: '#deeed5', color: '#4e7d33' }} className="text-center">{matchNotification}</Alert>}

      <h3 className="text-center mt-4">Search by Volunteer</h3>
      <Form>
        <Form.Group controlId="volunteerSelect" className="mb-3">
          <Form.Control as="select" onChange={(e) => setSelectedVolunteer(volunteers.find(v => v.id === parseInt(e.target.value))) }>
            <option value="">Select a Volunteer</option>
            {volunteers.map(volunteer => (
              <option key={volunteer.id} value={volunteer.id}>{volunteer.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {selectedVolunteer && (
          <Row className="justify-content-center">
            {selectedVolunteer.matchedEvents.map((event, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{event.location}</Card.Subtitle>
                    <Card.Text>
                      <strong>Date:</strong> {event.date} <br />
                      <strong>Time:</strong> {event.time}
                    </Card.Text>
                    <div className="mb-2">
                      <strong>Matched Skills: </strong> 
                      {selectedVolunteer.skills.filter(skill => event.skills.includes(skill)).map(skill => (
                        <Badge key={skill} bg="secondary" className="me-1">{skill}</Badge>
                      ))}
                    </div>
                    <Button className="w-100 mb-2" style={{ backgroundColor: '#2C365e', borderColor: '#8A95A5', color: 'white' }} onClick={() => setSelectedEvent(selectedEvent?.name === event.name ? null : event)}>
                      {selectedEvent?.name === event.name ? 'Hide Details' : 'View Details'}
                    </Button>
                    {selectedEvent?.name === event.name && (
                      <>
                        <Card.Text className="mt-2">{event.description}</Card.Text>
                        <Button className="w-100 mt-2" style={{ backgroundColor: '#60993E', borderColor: '#8A95A5', color: 'white' }} onClick={() => {
                          setMatchNotification(`${selectedVolunteer.name} has been matched with ${event.name}.`);
                          setTimeout(() => setMatchNotification(null), 2000);
                        }}>Match</Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Form>
    </Container>
  );
};

export default VolunteerMatching;
