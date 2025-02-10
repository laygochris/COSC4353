import React, { useState } from 'react';
import { Button, Container, Card } from 'react-bootstrap';

const VolunteerMatching = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Community Cleanup', skills: ['Organization', 'Teamwork'], description: 'Join us in cleaning up the local park and keeping our community clean.', location: 'Central Park', date: 'March 15, 2025', time: '10:00 AM - 2:00 PM' },
    { id: 2, name: 'Food Bank Assistance', skills: ['Cooking', 'Logistics'], description: 'Help sort and distribute food to families in need at the food bank.', location: 'Houston Food Bank', date: 'March 20, 2025', time: '9:00 AM - 12:00 PM' },
    { id: 3, name: 'Tutoring Program', skills: ['Teaching', 'Patience'], description: 'Tutor students in math and reading to help them succeed academically.', location: 'Local Library', date: 'March 25, 2025', time: '4:00 PM - 6:00 PM' },
    { id: 4, name: 'Animal Shelter Help', skills: ['Animal Care', 'Compassion'], description: 'Assist in caring for and socializing shelter animals to prepare them for adoption.', location: 'City Animal Shelter', date: 'March 30, 2025', time: '1:00 PM - 4:00 PM' },
  ]);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  const handleFilterChange = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filteredEvents = selectedSkills.length > 0
    ? events.filter(event => selectedSkills.some(skill => event.skills.includes(skill)))
    : events;

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Volunteer Matching</h2>
      <div className="mb-3 d-flex flex-wrap gap-2">
        {['Organization', 'Teamwork', 'Cooking', 'Logistics', 'Teaching', 'Patience', 'Animal Care', 'Compassion'].map(skill => (
          <Button 
            key={skill}
            variant={selectedSkills.includes(skill) ? "primary" : "outline-primary"} 
            className="skill-button rounded-pill"
            onClick={() => handleFilterChange(skill)}
          >
            {skill}
          </Button>
        ))}
      </div>
      <div className="d-flex flex-column align-items-center">
        {filteredEvents.map((event) => (
          <div key={event.id} className="w-50 mb-3">
            <Button
              variant="primary"
              className="event-button"
              onClick={() => handleEventClick(event)}
            >
              {event.name}
            </Button>
            {selectedEvent?.id === event.id && (
              <Card className="event-card">
                <Card.Text><strong>Description:</strong> {event.description}</Card.Text>
                <Card.Text><strong>Location:</strong> {event.location}</Card.Text>
                <Card.Text><strong>Date:</strong> {event.date}</Card.Text>
                <Card.Text><strong>Time:</strong> {event.time}</Card.Text>
              </Card>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default VolunteerMatching;
