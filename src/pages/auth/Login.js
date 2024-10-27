import React, { useState, useContext } from 'react';
import axios from 'axios';
// import { AuthContext } from '../../AuthContext'; // Import AuthContext
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';


const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);  // Use login from AuthContext
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login/', formData, { withCredentials: true , credentials: 'include'}
      );
      login(response.data.user_id,response.data.username);  // Update the context with logged-in user
      alert('Login successful');
      navigate('/');  // Redirect to home
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <Header />
      <h2 className='mt-4'>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
