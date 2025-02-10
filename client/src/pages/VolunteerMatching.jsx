import React, { useState } from 'react';
import { Button, Container, Card, Row, Col, Badge, Form, Alert } from 'react-bootstrap';

const VolunteerMatching = () => {
  const [volunteers, setVolunteers] = useState([
    { 
      id: 1, 
      name: 'Alice Johnson', 
      skills: ['Organization', 'Teamwork'], 
      matchedEvents: [
        { name: 'Community Cleanup', location: 'Central Park', date: 'March 15, 2025', time: '10:00 AM - 2:00 PM', skills: ['Organization', 'Teamwork'], description: 'Join us in cleaning up the local park and keeping our community clean.' },
        { name: 'Beach Cleanup', location: 'Santa Monica Beach', date: 'April 10, 2025', time: '9:00 AM - 1:00 PM', skills: ['Teamwork'], description: 'Help us remove trash and protect marine life at Santa Monica Beach.' }
      ]
    },
    { 
      id: 2, 
      name: 'Bob Smith', 
      skills: ['Cooking', 'Logistics'], 
      matchedEvents: [
        { name: 'Food Bank Assistance', location: 'Houston Food Bank', date: 'March 20, 2025', time: '9:00 AM - 12:00 PM', skills: ['Logistics'], description: 'Help sort and distribute food to families in need at the food bank.' },
        { name: 'Soup Kitchen Service', location: 'Downtown Shelter', date: 'April 5, 2025', time: '11:00 AM - 3:00 PM', skills: ['Cooking', 'Logistics'], description: 'Assist in cooking and serving meals to the homeless.' }
      ]
    }
  ]);

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [matchNotification, setMatchNotification] = useState(null);
  const [searchSkill, setSearchSkill] = useState('');

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Volunteer Matching Form</h2>
      <h3 className="text-center mt-4">Search by Volunteer</h3>
      {matchNotification && <Alert style={{ backgroundColor: '#deeed5', borderColor: '#deeed5', color: '#4e7d33' }} className="text-center">{matchNotification}</Alert>}
      <Form>
        <Form.Group controlId="volunteerSelect" className="mb-3">
          <Form.Label>Search for Volunteers by Name</Form.Label>
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
      
      <h3 className="text-center mt-4">Search by Skill</h3>
      <Form.Group controlId="skillSearch" className="mb-3">
        <Form.Label>Search for Volunteers by Skill</Form.Label>
        <Form.Control type="text" placeholder="Enter skill" value={searchSkill} onChange={(e) => setSearchSkill(e.target.value)} />
      </Form.Group>
      <Row className="justify-content-center">
        {volunteers.filter(volunteer => volunteer.skills.some(skill => skill.toLowerCase().includes(searchSkill.toLowerCase()))).map((volunteer) => (
          <Col md={6} key={volunteer.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{volunteer.name}</Card.Title>
                <Card.Text>
                  <strong>Skills:</strong> {volunteer.skills.map(skill => (
                    <Badge key={skill} bg="secondary" className="me-1">{skill}</Badge>
                  ))}
                </Card.Text>
                <Button className="w-100 mt-2" style={{ backgroundColor: '#60993E', borderColor: '#8A95A5', color: 'white' }} onClick={() => {
                  setMatchNotification(`${volunteer.name} has been matched based on skill search.`);
                  setTimeout(() => setMatchNotification(null), 2000);
                }}>Match</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VolunteerMatching;
