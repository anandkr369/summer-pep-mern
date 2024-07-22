import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [personalDetails, setPersonalDetails] = useState({
    username: '',
    email: '',
    age: '',
    dateOfBirth: '',
    pic: { url: '' }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isPersonalDetailsOpen, setIsPersonalDetailsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/verify').then(res => {
      if (!res.data.status)
        navigate('/login');
      else {
        fetchAppliedOpportunity();
        fetchPersonalDetails();
      }
    });
  }, [navigate]);

  const fetchAppliedOpportunity = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/applied-opportunity');
      setData(res.data);
    } catch (error) {
      console.error("Error fetching applied opportunities:", error);
    }
  };

  const fetchPersonalDetails = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/personal-details');
      setPersonalDetails(res.data);
    } catch (error) {
      console.error("Error fetching personal details:", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/update-personal-details', personalDetails);
      if (res.data.status) {
        setPersonalDetails(res.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating personal details:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Navbar */}
      <Navbar
        personalDetails={personalDetails}
        isPersonalDetailsOpen={isPersonalDetailsOpen}
        setIsPersonalDetailsOpen={setIsPersonalDetailsOpen}
        handleEditToggle={handleEditToggle}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-4 sm:px-6 sm:py-16 lg:px-8 lg:py-16 ml-64">
        <h2 className="text-2xl font-bold mb-6">Applied Opportunities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((opportunity, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2"><b>Profile:</b> {opportunity.profile_name}</h3>
              <p className="text-sm mb-2"><strong>Company:</strong> {opportunity.company_name}</p>
              <p className="text-sm mb-2"><strong>Salary:</strong> {opportunity.stipend}</p>
              <p className="text-sm mb-2"><strong>Time-span:</strong> {opportunity.duration}</p>
              <p className="text-sm mb-2"><strong>Applier:</strong> {opportunity.userId}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
