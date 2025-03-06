import React, {useState} from "react";
import "./UserProfile.css";
import Select from "react-select";
import { Container, Card, Form, Button } from "react-bootstrap";



const UserProfile = () => {
    const [userInfo, setUserInfo] = useState ({
        fullName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        skills: [],
        preferences: "",
        availability: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errors, setErrors] = useState({});

    const states = [
        { label: "Alabama", value: "AL" },
        { label: "Alaska", value: "AK" },
        { label: "Arizona", value: "AZ" },
        { label: "Arkansas", value: "AR" },
        { label: "California", value: "CA" },
        { label: "Colorado", value: "CO" },
        { label: "Connecticut", value: "CT" },
        { label: "Delaware", value: "DE" },
        { label: "Florida", value: "FL" },
        { label: "Georgia", value: "GA" },
        { label: "Hawaii", value: "HI" },
        { label: "Idaho", value: "ID" },
        { label: "Illinois", value: "IL" },
        { label: "Indiana", value: "IN" },
        { label: "Iowa", value: "IA" },
        { label: "Kansas", value: "KS" },
        { label: "Kentucky", value: "KY" },
        { label: "Louisiana", value: "LA" },
        { label: "Maine", value: "ME" },
        { label: "Maryland", value: "MD" },
        { label: "Massachusetts", value: "MA" },
        { label: "Michigan", value: "MI" },
        { label: "Minnesota", value: "MN" },
        { label: "Mississippi", value: "MS" },
        { label: "Missouri", value: "MO" },
        { label: "Montana", value: "MT" },
        { label: "Nebraska", value: "NE" },
        { label: "Nevada", value: "NV" },
        { label: "New Hampshire", value: "NH" },
        { label: "New Jersey", value: "NJ" },
        { label: "New Mexico", value: "NM" },
        { label: "New York", value: "NY" },
        { label: "North Carolina", value: "NC" },
        { label: "North Dakota", value: "ND" },
        { label: "Ohio", value: "OH" },
        { label: "Oklahoma", value: "OK" },
        { label: "Oregon", value: "OR" },
        { label: "Pennsylvania", value: "PA" },
        { label: "Rhode Island", value: "RI" },
        { label: "South Carolina", value: "SC" },
        { label: "South Dakota", value: "SD" },
        { label: "Tennessee", value: "TN" },
        { label: "Texas", value: "TX" },
        { label: "Utah", value: "UT" },
        { label: "Vermont", value: "VT" },
        { label: "Virginia", value: "VA" },
        { label: "Washington", value: "WA" },
        { label: "West Virginia", value: "WV" },
        { label: "Wisconsin", value: "WI" },
        { label: "Wyoming", value: "WY" }

    ];


    const skills =[
        {label:"Problem Solving", value:"Problem Solving" },
        {label:"Time management", value:"Time management" },
        {label:"Teamwork", value:"Teamwork" },

    ]

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
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

    const checkPage = () => {
        let newErrors = {};
        if (!userInfo.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!userInfo.address1.trim()) newErrors.address1 = "Address 1 is required";
        if (!userInfo.city.trim()) newErrors.city = "City is required";
        if (!userInfo.state) newErrors.state = "State is required";
        if (!/^[0-9]{5,9}$/.test(userInfo.zip))
            newErrors.zip = "Invalid zip code (5-9 digits)";
        if (userInfo.skills.length === 0) newErrors.skills = "Select at least one skill";
        if (userInfo.availability.length === 0) newErrors.availability = "Select at least one date";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (checkPage()) {
            try {
                setIsSubmitting(true);

                const response = await fetch("http://localhost:5001/api/user-profile/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: userInfo.userId,
                        fullName: userInfo.fullName,
                        address: `${userInfo.address1} ${userInfo.address2}`.trim(),
                        city: userInfo.city,
                        state: userInfo.state,
                        zip: userInfo.zip,
                        skills: userInfo.skills,
                        preference: userInfo.preferences,
                        availability: userInfo.availability
                    })
                });

                const data = await response.json();
                console.log("Response Status:", response.status);
                console.log("Response Data:", data);

                if (!response.ok) {
                    throw new Error(data.message || "Failed to update profile");
                }

                alert("Profile Updated Successfully!");

            } catch (error) {
                console.error("Error updating profile:", error);
                alert(error.message || "Error updating profile. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    const handleSkillsChange = (selectedOptions) => {
        setUserInfo((prev) => ({
            ...prev,
            skills: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        }));
    };
    return (
        <Container className="user-profile-container">
            <Card className="user-profile-form shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4">User Profile</h2>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={userInfo.fullName}
                                onChange={handleChange}
                                maxLength="50"
                                className={errors.fullName ? "is-invalid" : ""}
                            />
                            <div className="invalid-feedback">{errors.fullName}</div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Address 1</Form.Label>
                            <Form.Control
                                type="text"
                                name="address1"
                                value={userInfo.address1}
                                onChange={handleChange}
                                maxLength="100"
                                className={errors.address1 ? "is-invalid" : ""}
                            />
                            <div className="invalid-feedback">{errors.address1}</div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Address 2 (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                name="address2"
                                value={userInfo.address2}
                                onChange={handleChange}
                                maxLength="100"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={userInfo.city}
                                onChange={handleChange}
                                maxLength="100"
                                className={errors.city ? "is-invalid" : ""}
                            />
                            <div className="invalid-feedback">{errors.city}</div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Select
                                name="state"
                                value={userInfo.state} 
                                onChange={handleChange}
                                className={errors.state ? "is-invalid" : ""}
                            >
                                <option value="">Select a state</option>
                                {states.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label} ({s.value}) {}
                                    </option>
                                ))}
                            </Form.Select>
                            <div className="invalid-feedback">{errors.state}</div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="zip"
                                value={userInfo.zip}
                                onChange={handleChange}
                                maxLength="9"
                                className={errors.zip ? "is-invalid" : ""}
                            />
                            <div className="invalid-feedback">{errors.zip}</div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Select Skills</Form.Label>
                            <Select
                                isMulti
                                options={skills}
                                onChange={handleSkillsChange}
                                className={errors.skills ? "is-invalid" : ""}
                            />
                            <div className="invalid-feedback">{errors.skills}</div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Preferences</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="preferences"
                                value={userInfo.preferences}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Availability</Form.Label>
                            <Form.Control type="date" onChange={handleDateChange} className={errors.availability ? "is-invalid" : ""} />
                            <div className="invalid-feedback">{errors.availability}</div>
                            <ul className="availability-list mt-2">
                                {userInfo.availability.map((date, index) => (
                                    <li key={index} className="d-flex justify-content-between align-items-center">
                                        {date}
                                        <Button variant="danger" size="sm" onClick={() => removeDate(date)}>X</Button>
                                    </li>
                                ))}
                            </ul>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">Save Profile</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;
