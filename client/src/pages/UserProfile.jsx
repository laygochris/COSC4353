import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import "./UserProfile.css";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    skills: [],
    preferences: [],
    availability: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const states = [
    { label: "Texas", value: "TX" },
    { label: "California", value: "CA" },
    { label: "New York", value: "NY" },
    { label: "Florida", value: "FL" },
    // Add more states as needed...
  ];

  const skillsOptions = [
    { label: "Problem Solving", value: "Problem Solving" },
    { label: "Time Management", value: "Time Management" },
    { label: "Teamwork", value: "Teamwork" },
    { label: "Leadership", value: "Leadership" },
    { label: "Communication", value: "Communication" },
    { label: "Organization", value: "Organization" },
    { label: "Animal Care", value: "Animal Care" },
  ];

  const preferenceOptions = [
    { label: "Teaching", value: "Teaching" },
    { label: "Disaster Relief", value: "Disaster Relief" },
    { label: "Youth Mentoring", value: "Youth Mentoring" },
    { label: "Elder Care", value: "Elder Care" },
    { label: "Environmental Cleanup", value: "Environmental Cleanup" },
    { label: "Food Distribution", value: "Food Distribution" },
    { label: "Animal Rescue", value: "Animal Rescue" },
    { label: "Community Outreach", value: "Community Outreach" },
    { label: "Food Drive", value: "Food Drive" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!token || !storedUserId) {
      alert("⚠️ You must be logged in to access your profile.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/user/profile/${storedUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to load user profile");

        const user = await response.json(); // No `.profile` key

        setUserInfo({
          fullName: user.fullName || "",
          address1: user.address || "",
          address2: "",
          city: user.city || "",
          state: user.state || "",
          zipcode: user.zipcode || "",
          skills: Array.isArray(user.skills) ? user.skills : [],
          preferences: Array.isArray(user.preferences)
            ? user.preferences
            : [],
          availability: Array.isArray(user.availability)
            ? user.availability
            : [],
        });
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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
      preferences: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    if (userInfo.availability.includes(date)) return;
    setUserInfo((prev) => ({
      ...prev,
      availability: [...prev.availability, date],
    }));
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
    if (!userInfo.zipcode.match(/^[0-9]{5,9}$/)) newErrors.zipcode = "Invalid Zip";
    if (!userInfo.skills.length) newErrors.skills = "Select at least one";
    if (!userInfo.availability.length) newErrors.availability = "Add at least one date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!token || !storedUserId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5001/api/user/profile/${storedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userInfo),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("❌ Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow p-4">
        <h3 className="mb-4 fw-semibold">📝 Update Your Profile</h3>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleChange}
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  name="zipcode"
                  value={userInfo.zipcode}
                  onChange={handleChange}
                  isInvalid={!!errors.zipcode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.zipcode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address 1</Form.Label>
                <Form.Control
                  name="address1"
                  value={userInfo.address1}
                  onChange={handleChange}
                  isInvalid={!!errors.address1}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address1}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address 2 (optional)</Form.Label>
                <Form.Control
                  name="address2"
                  value={userInfo.address2}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  value={userInfo.city}
                  onChange={handleChange}
                  isInvalid={!!errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Select
                  name="state"
                  value={userInfo.state}
                  onChange={handleChange}
                  isInvalid={!!errors.state}
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Skills</Form.Label>
                <Select
                  isMulti
                  options={skillsOptions}
                  value={skillsOptions.filter((opt) =>
                    userInfo.skills.includes(opt.value)
                  )}
                  onChange={handleSkillsChange}
                  classNamePrefix="react-select"
                />
                {errors.skills && (
                  <div className="text-danger mt-1 small">{errors.skills}</div>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Preferences</Form.Label>
                <Select
                  isMulti
                  options={preferenceOptions}
                  value={preferenceOptions.filter((opt) =>
                    userInfo.preferences.includes(opt.value)
                  )}
                  onChange={handlePreferencesChange}
                  classNamePrefix="react-select"
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Availability</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleDateChange}
                  isInvalid={!!errors.availability}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.availability}
                </Form.Control.Feedback>
                <ListGroup className="mt-2">
                  {userInfo.availability.map((date, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {date}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeDate(date)}
                      >
                        ✕
                      </Button>
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
