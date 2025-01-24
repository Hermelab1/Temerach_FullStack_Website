import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('1');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRegistering) {
      // Handle registration
      try {
        const response = await axios.post('http://localhost:4001/api/register', {
          username,
          password,
          roleId,
        });

        console.log(response.data);
        setIsRegistering(false);
        setUsername('');
        setPassword('');
        setRoleId('1');
        setErrorMessage('');
        navigate('/login', { replace: true });
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Registration failed.');
      }
    } else {
      // Handle login
      try {
        const response = await axios.post('http://localhost:4001/api/login', {
          username,
          password,
        });

        console.log(response.data);

        // Assuming the token is provided in response, storing it locally
        localStorage.setItem('adminToken', response.data.token); // Adjust based on your actual response structure
        
        // Navigate to the admin page
        navigate('/admin', { replace: true }); // Change '/admin/dashboard' to the correct route for your admin dashboard
      } catch (error) {
        console.error('Login error:', error);
        setErrorMessage(error.response?.data?.error || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md h-[60vh]">
        <h2 className="text-lg font-bold mb-4">{isRegistering ? 'Create User' : 'Login'}</h2>
        
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-600 text-sm mb-2" htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            placeholder='Enter User Name'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full py-2 pl-10 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
          />
          
          <label className="block text-gray-600 text-sm mb-2" htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder='Enter User Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-2 pl-10 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
          />
          
          {isRegistering && (
            <>
              <label className="block text-gray-600 text-sm mb-2" htmlFor="roleId">Role ID:</label>
              <input
                type="text"
                name="roleId"
                placeholder='Enter Role ID'
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full py-2 pl-10 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
              />
            </>
          )}
          
          <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md block w-full">
            {isRegistering ? 'Create User' : 'Login'}
          </button>
        </form>
        
        {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
        
        <div className="text-center mt-4">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)} className="text-blue-500">Login here.</button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegistering(true)} className="text-blue-500">Create User.</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;