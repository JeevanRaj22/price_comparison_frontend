import React, { useContext, useState } from 'react'
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';


function WishlistBtn(props) {
  const { userId } = useContext(AuthContext); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToWishlist = async () => {
    if (!userId) {
      alert('You need to be logged in to add items to your wishlist.');
      return;
    }
    
    setLoading(true);
    setError(null);


    try {
      const response = await axios.post('http://localhost:8000/wishlist/add/', props.productData);
      if (response.status === 201) {
        alert('Product added to wishlist successfully!');
      } else {
        throw new Error('Failed to add product to wishlist.');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error adding product to wishlist:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
        <button 
        className="wishlist-add-btn" 
        onClick={addToWishlist} 
        disabled={props.loading}>
            {loading ? 'Adding...' : 'Add to wishlist'} <i id="wishlist-icon" className="fa-solid fa-cart-plus"></i>
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
    
  )
}

export default WishlistBtn