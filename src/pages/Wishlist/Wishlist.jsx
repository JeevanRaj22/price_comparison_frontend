import React, { useState, useContext, useEffect } from 'react';
import WishlistCard from './WishlistCard';
import Header from '../../components/header/Header';
import { AuthContext } from '../auth/AuthContext';

function Wishlist() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useContext(AuthContext);
   

    useEffect(() => {
        if (!userId) {
            setLoading(false);  // No need to fetch if userId is null
            return;
        }

        // Fetch wishlist products from Django API
        const fetchWishlist = async () => {
            try {
                const response = await fetch(`http://localhost:8000/wishlist/${userId}/`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                setProducts(data.wishlist);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [userId]);

    const removeProduct = async (productId) => {
        setLoading(true);
        setError(null);
    
        try {
          const response = await fetch('http://localhost:8000/wishlist/remove/', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              product_id: productId
            }),
          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
    
          const data = await response.json();
          console.log(data.message); // Log success message
    
          // Remove the product from the state if the deletion was successful
          setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userId) {
        
        return <p>Please log in to view your wishlist.</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <Header />
            <div id="wishlist-container">
                <h1 id="wishlist-title">Your Wishlist</h1>
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <WishlistCard
                            key={index} // Add key prop
                            name={product["flipkart_name"]}
                            amazon_price={product["amazon_price"]}
                            flipkart_price={product["flipkart_price"]}
                            amazon_url={product["amazon_url"]}
                            flipkart_url={product["flipkart_url"]}
                            image={product["image"]}
                            onRemove={() => removeProduct(product.product_id)}
                        />
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </>
    );
}

export default Wishlist;
