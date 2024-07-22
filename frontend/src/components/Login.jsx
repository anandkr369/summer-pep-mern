import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');

    if (!email || !password) {
      setError('Please fill all the fields');
      return;
    }

    setLoading(true);

    try {
      const response = await Axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      if (response.data.status) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Error occurred, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="email" className="w-32 text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(''); // Clear error when user types
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby="email-error"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="password" className="w-32 text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(''); // Clear error when user types
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-describedby="password-error"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-indigo-600 hover:underline"
            >
              SignUp
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4" id="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
