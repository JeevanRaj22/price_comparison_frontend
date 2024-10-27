import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import WishlistBtn from '../Wishlist/WishlistBtn';

function ProductCard(props) {
  const { userId } = useContext(AuthContext);
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  const productData = {
    user_id: userId,
    amazon_name: props.name,
    flipkart_name: props.name,
    image: props.image,
    amazon_url: props.amazon_url,
    flipkart_url: props.flipkart_url,
    amazon_price: props.amazon_price,
    flipkart_price: props.flipkart_price,
    ram: props.ram,
    rom: props.rom,
    color: props.color,
  };

  return (
    <div 
      className="product-item" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure>
        <img src={props.image} alt="Product" className='product-item-img'/>
      </figure>
      <div>
        <h3 className='product-item-title'>{props.name}</h3>
        <div style={{ textAlign: "center" }}>
          <h5>Amazon price: {props.amazon_price.toLocaleString("en-US", { style: "currency", currency: "INR" })}</h5>
          <h5>Flipkart price: {props.flipkart_price.toLocaleString("en-US", { style: "currency", currency: "INR" })}</h5>
          <div className={`ram-detail-div ${isHovered ? 'show' : ''}`}>
            <h5>Ram: {props.ram} GB</h5>
            <h5>Rom: {props.rom} GB</h5>
            <h5>Color: {props.color}</h5>
          </div>
        </div>
        <div className="product-item-links">
          <a href={props.amazon_url} target="_blank" rel="noreferrer">
            <img src='/amazon.svg' alt="amazon-logo"/>
          </a>
          <a href={props.flipkart_url} target="_blank" rel="noreferrer">
            <img src='/flipkart.svg' alt="flipkart-logo"/>
          </a>
        </div>
        <Link to={"/product-detail"} state={props}>
          <button className="wishlist-add-btn">
            More Details
          </button>
        </Link>
        <WishlistBtn productData={productData}/>
      </div>
    </div>
  );
}

export default ProductCard;
