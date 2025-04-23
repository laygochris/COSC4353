import React, { useState } from "react";
import Select from "react-select";
import { Container, Card, Form, Button, Row, Col, ListGroup, Spinner } from "react-bootstrap";
import "./UserProfile.css";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    skills: [],
    preferences: [],
    availability: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const states = ["TX", "CA", "NY", "FL", "WA"].map((s) => ({ label: s, value: s }));
  const skillsOptions = [
    { label: "Problem Solving", value: "Problem Solving" },
    { label: "Time Management", value: "Time Management" },
    { label: "Teamwork", value: "Teamwork" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setUserInfo((prev) => ({
      ...prev,
      skills: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handlePreferencesChange = (selectedOptions) => {
    setUserInfo((prev) => ({
      ...prev,
      preferences: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleDateChange = (e) => {
    setUserInfo((prev) => ({ ...prev, availability: [...prev.availability, e.target.value] }));
  };

  const removeDate = (dateToRemove) => {
    setUserInfo((prev) => ({
      ...prev,
      availability: prev.availability.filter((date) => date !== dateToRemove),
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!userInfo.fullName) newErrors.fullName = "Required";
    if (!userInfo.address1) newErrors.address1 = "Required";
    if (!userInfo.city) newErrors.city = "Required";
    if (!userInfo.state) newErrors.state = "Required";
    if (!userInfo.zip.match(/^[0-9]{5,9}$/)) newErrors.zip = "Invalid Zip";
    if (!userInfo.skills.length) newErrors.skills = "Select at least one";
    if (!userInfo.availability.length) newErrors.availability = "Add at least one date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/user-profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          ...userInfo,
        }),
      });

      if (!response.ok) throw new Error("Update failed");
      alert("✅ Profile updated successfully!");
    } catch (error) {
      alert("❌ Update failed.");
    }
    setIsSubmitting(false);
  };

  return (
    <Container className="py-5">
      <Card className="shadow p-4">
        <h3 className="mb-4 fw-semibold">📝 Update Your Profile</h3>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="fullName" value={userInfo.fullName} onChange={handleChange} isInvalid={!!errors.fullName} />
                <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control name="zip" value={userInfo.zip} onChange={handleChange} isInvalid={!!errors.zip} />
                <Form.Control.Feedback type="invalid">{errors.zip}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Address 1</Form.Label>
                <Form.Control name="address1" value={userInfo.address1} onChange={handleChange} isInvalid={!!errors.address1} />
                <Form.Control.Feedback type="invalid">{errors.address1}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Address 2 (optional)</Form.Label>
                <Form.Control name="address2" value={userInfo.address2} onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control name="city" value={userInfo.city} onChange={handleChange} isInvalid={!!errors.city} />
                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Select name="state" value={userInfo.state} onChange={handleChange} isInvalid={!!errors.state}>
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Skills</Form.Label>
                <Select
                  isMulti
                  options={skillsOptions}
                  value={skillsOptions.filter((opt) => userInfo.skills.includes(opt.value))}
                  onChange={handleSkillsChange}
                  classNamePrefix="react-select"
                />
                {errors.skills && <div className="text-danger mt-1 small">{errors.skills}</div>}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Preferred Skills</Form.Label>
                <Select
                  isMulti
                  options={skillsOptions}
                  value={skillsOptions.filter((opt) => userInfo.preferences.includes(opt.value))}
                  onChange={handlePreferencesChange}
                  classNamePrefix="react-select"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Availability</Form.Label>
                <Form.Control type="date" onChange={handleDateChange} isInvalid={!!errors.availability} />
                <Form.Control.Feedback type="invalid">{errors.availability}</Form.Control.Feedback>
                <ListGroup className="mt-2">
                  {userInfo.availability.map((date, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      {date}
                      <Button variant="outline-danger" size="sm" onClick={() => removeDate(date)}>✕</Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            className="w-100 mt-4"
            style={{ backgroundColor: "#60993E", borderColor: "#60993E" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default UserProfile;