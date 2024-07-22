import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({
  personalDetails,
  isPersonalDetailsOpen,
  setIsPersonalDetailsOpen,
  handleEditToggle,
  handleInputChange,
  handleFormSubmit,
  isEditing,
  setIsEditing,
  isLoggedIn // Add this prop to manage authentication state
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout');
      if (typeof setIsPersonalDetailsOpen === 'function') {
        setIsPersonalDetailsOpen(false); // Disable personal details on logout
      }
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    // Ensure personal details are visible if logged in
    if (isLoggedIn) {
      if (typeof setIsPersonalDetailsOpen === 'function') {
        setIsPersonalDetailsOpen(true);
      }
    }
  }, [isLoggedIn, setIsPersonalDetailsOpen]);

  return (
    <>
      {/* Trigger button for small devices */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 sm:hidden bg-gray-800 text-white p-2 rounded"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-md transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">JobPortal</h1>
          <button onClick={toggleMenu} className="lg:hidden text-white sm:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <div className="flex flex-col mt-6 space-y-2">
          <NavLink to="/" className="px-4 py-2 hover:bg-gray-700">Home</NavLink>
          <NavLink to="/dashboard" className="px-4 py-2 hover:bg-gray-700">Dashboard</NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-left w-full hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
        
        {/* Personal Details Toggle Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => {
              console.log('Toggle Personal Details:', !isPersonalDetailsOpen);
              if (typeof setIsPersonalDetailsOpen === 'function') {
                setIsPersonalDetailsOpen(!isPersonalDetailsOpen);
              }
            }}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700"
          >
            {isPersonalDetailsOpen ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Personal Details Modal */}
        {isPersonalDetailsOpen && (
          <>
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="w-auto max-w-3xl bg-white text-black shadow-md rounded-lg p-6 relative">
                {isEditing ? (
                  <form onSubmit={handleFormSubmit} className="w-full">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                        {personalDetails.pic.url && (
                          <img src={personalDetails.pic.url} alt="Profile" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="w-full">
                        <div className="flex items-center mb-4">
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 w-1/3">Name:</label>
                          <input
                            id="username"
                            type="text"
                            name="username"
                            value={personalDetails.username}
                            onChange={handleInputChange}
                            className="mt-1 block w-2/3 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="flex items-center mb-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 w-1/3">Email:</label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={personalDetails.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-2/3 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="flex items-center mb-4">
                          <label htmlFor="age" className="block text-sm font-medium text-gray-700 w-1/3">Age:</label>
                          <input
                            id="age"
                            type="number"
                            name="age"
                            value={personalDetails.age}
                            onChange={handleInputChange}
                            className="mt-1 block w-2/3 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <div className="flex items-center mb-4">
                          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 w-1/3">Date of Birth:</label>
                          <input
                            id="dateOfBirth"
                            type="date"
                            name="dateOfBirth"
                            value={personalDetails.dateOfBirth}
                            onChange={handleInputChange}
                            className="mt-1 block w-2/3 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="mr-4 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="w-full">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                        {personalDetails.pic.url && (
                          <img src={personalDetails.pic.url} alt="Profile" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="w-full">
                        <div className="flex items-center mb-4">
                          <label className="block text-sm font-medium text-gray-700 w-1/3">Name:</label>
                          <div className="mt-1 block w-2/3">{personalDetails.username}</div>
                        </div>
                        <div className="flex items-center mb-4">
                          <label className="block text-sm font-medium text-gray-700 w-1/3">Email:</label>
                          <div className="mt-1 block w-2/3">{personalDetails.email}</div>
                        </div>
                        <div className="flex items-center mb-4">
                          <label className="block text-sm font-medium text-gray-700 w-1/3">Age:</label>
                          <div className="mt-1 block w-2/3">{personalDetails.age}</div>
                        </div>
                        <div className="flex items-center mb-4">
                          <label className="block text-sm font-medium text-gray-700 w-1/3">Date of Birth:</label>
                          <div className="mt-1 block w-2/3">{personalDetails.dateOfBirth}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleEditToggle}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (typeof setIsPersonalDetailsOpen === 'function') {
                      setIsPersonalDetailsOpen(false);
                    }
                  }}
                  className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
