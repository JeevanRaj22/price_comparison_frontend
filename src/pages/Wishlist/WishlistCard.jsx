import React from 'react'
import { Link } from 'react-router-dom'

function WishlistCard(props) {
  return (
    <div className="wishlist-item">
    <figure>
      <img src={props.image} alt="" className='product-item-img'/>
    </figure>
    <div>
      <Link to={"/product-detail"} state={props}> <h3 className='product-item-title'>{props.name}</h3></Link>
      <div>
        <h5>Amazon price:{props["amazon_price"].toLocaleString("en-US", {style:"currency", currency:"INR"})}</h5>
        <h5>Flipkart price:{props["flipkart_price"].toLocaleString("en-US", {style:"currency", currency:"INR"})}</h5>
      </div>
      <div className="product-item-links">
        <a href={props["amazon_url"]} target="_blank" rel="noreferrer"><img src='/amazon.svg' alt="amazon-logo"/></a>
        <a href={props["flipkart_url"]} target="_blank" rel="noreferrer"><img src='/flipkart.svg' alt="flipkart-logo"/></a>
      </div>
      <button onClick={props.onRemove} id="wishlist-remove-btn">Remove From wishlist</button>
    </div>
  </div>
  )
}

export default WishlistCard