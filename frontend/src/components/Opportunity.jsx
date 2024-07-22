import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import opportunityData from '../assets/opportunities.json';
import Navbar from './Navbar';

const Opportunity = () => {
  const [appliedOpp, setAppliedOpp] = useState([]);

  useEffect(() => {
    fetchAppliedOpportunity();
  }, []);

  const fetchAppliedOpportunity = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/all-opportunity');
      setAppliedOpp(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-grow bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 ml-64">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Internship Opportunities</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.keys(opportunityData.internships_meta).map(key => {
            const opportunity = opportunityData.internships_meta[key];
            return (
              <OpportunityCard key={key} opportunity={opportunity} appliedOpp={appliedOpp} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const OpportunityCard = ({ opportunity, appliedOpp }) => {
  const navigate = useNavigate();
  const {
    id,
    profile_name,
    stipend = {},
    company_name,
    start_date,
    locations = [],
    duration
  } = opportunity;

  const isApplied = Array.isArray(appliedOpp) && appliedOpp.some(item => item.id === id);

  const applyForOpportunity = async (opportunity) => {
    try {
      await axios.post('http://localhost:3000/auth/apply', { opportunity })
        .then(res => console.log(res));
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col border border-gray-200">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{profile_name}</h2>
      <p className="text-sm mb-2 text-gray-700"><strong>Company:</strong> {company_name}</p>
      <p className="text-sm mb-2 text-gray-700"><strong>Stipend:</strong> {stipend.salary || 'N/A'}</p>
      <p className="text-sm mb-2 text-gray-700"><strong>Location:</strong> {locations.map(l => l.string).join(', ')}</p>
      <p className="text-sm mb-2 text-gray-700"><strong>Duration:</strong> {duration}</p>
      <p className="text-sm mb-4 text-gray-700"><strong>Start Date:</strong> {start_date}</p>
      <div className="mt-auto">
        {isApplied ? (
          <button disabled className="w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed">
            Applied
          </button>
        ) : (
          <button
            onClick={() => applyForOpportunity(opportunity)}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default Opportunity;
