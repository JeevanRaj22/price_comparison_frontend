import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../pages/auth/AuthContext';
import axios from 'axios';  // Import axios for making HTTP requests

function Header() {
  const { user, logout } = useContext(AuthContext);  // Access the user and logout function from AuthContext

  async function handleLogOut() {
    try {
      const response = await axios.post('http://localhost:8000/auth/logout/',{},{withCredentials: true,
      credentials: 'include'});  // Make logout request to backend
      if (response.data.message) {
        logout();  // Call logout function from context to update state
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <header>
      <Link to="/"><h1 id="title">Price Comparison Tool</h1></Link>

      <div>
        {user ? (
          <>
            <Link to="/wishlist"><h3>Wishlist</h3></Link>
            <button onClick={handleLogOut}>Logout</button> {/* Logout button */}
          </>
        ) : (
          <>
            <Link to="/login"><h3>Login</h3></Link>
            <Link to="/register"><h3>Register</h3></Link>
            
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
