import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import Header from '../../components/header/Header';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext'; 
import WishlistBtn from '../Wishlist/WishlistBtn';
import { Bars } from 'react-loader-spinner'


function ProductDetails() {
    const location = useLocation(); // Use useLocation hook
    const [amazonTaskId, setAmazonTaskId] = useState(null);
    const [flipkartTaskId, setFlipkartTaskId] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({});
    const { userId } = useContext(AuthContext);

    const { state } = location; // Access state from the location object
    const productData = {
        user_id: userId,
        amazon_name: state?.name,
        flipkart_name: state?.name,
        image: state?.image,
        amazon_url: state?.amazon_url,
        flipkart_url: state?.flipkart_url,
        amazon_price: state?.amazon_price,
        flipkart_price: state?.flipkart_price,
        ram: state?.ram,
        rom: state?.rom,
        color: state?.color
      };

    useEffect(() => {
        if (state) {
            startScraping();
        }
    }, [state]);

    const startScraping = async () => {
        setLoading(true); 
        try {
            const response = await axios.post('http://localhost:8000/start-scrape-detail/', {
                "amazon_url": state.amazon_url,
                "flipkart_url": state.flipkart_url
            });
            setAmazonTaskId(response.data.amazon_task_id);
            setFlipkartTaskId(response.data.flipkart_task_id);
            setStatus('pending');
        } catch (error) {
            setStatus('error');
            console.error('Error starting the scraping task:', error);
        }
    };

    const checkStatus = async () => {
        if (!amazonTaskId || !flipkartTaskId) {
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/check-status-detail/?amazon_task_id=${amazonTaskId}&flipkart_task_id=${flipkartTaskId}`);
            if (response.data.status === 'completed') {
                setStatus('completed');
                setDetails(response.data);
                // alert('success');
                console.log(response.data);
                setLoading(false);
            } else {
                setStatus('pending');
                // alert('pending');
            }
        } catch (error) {
            setStatus('error');
            console.error('Error checking the scraping status:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (status === 'pending') {
                checkStatus();
            }
        }, 15000); // Check every 15 seconds

        return () => clearInterval(intervalId);
    }, [status]);

    return (
        <>
            <Header />
            {loading ? (
                <div class="spinner">
                    <Bars
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    style={{
                        marginRight:"auto",
                        marginLeft:"auto"
                    }}
                    />
                    <p>Please wait, we are currently retrieving the product information.</p>
                </div> 
                ) : (
                <section id="product-detail-section">
                    <div id="product-detail">
                        <div id="img-product-detail">
                            <img src={state?.image} alt="Product" /> {/* Use optional chaining */}
                            <div id="link-div-detail">
                                <a href={state["amazon_url"]} target="_blank" rel="noreferrer"><img src='/amazon.svg' alt="amazon-logo"/></a>
                                <a href={state["flipkart_url"]} target="_blank" rel="noreferrer"><img src='/flipkart.svg' alt="flipkart-logo"/></a>
                                
                            </div>
                        </div>
                        <div id="detail-section">
                            <div><h1>{state?.["name"]}</h1> </div>
                            {/* Use optional chaining */}
                            <WishlistBtn productData={productData} />
                            <h3>Product Overview</h3>
                            <table id="overview-table" className="bd-btm">
                                <tbody>
                                    {details["amazon_data"]?.["overview"]?.map((data, index) => (
                                        <tr key={index}>
                                            <th>{data["th"]}</th>
                                            <td>{data["tr"]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div id="offers">
                                <h3>Amazon Offers</h3>
                                <ul className="bd-btm">
                                    {details["amazon_data"]?.["offers"]?.map((data, index) => (
                                        <li key={index}><b>{data["title"]}:</b>{data["content"]}</li>
                                    ))}
                                </ul>
                                <h3 className='mt-3'>Flipkart Offers</h3>
                                <ul>
                                    {details["flipkart_data"]?.["offers"]?.map((data, index) => (
                                        <li key={index}><b>{data["title"]}:</b>{data["content"]}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div id="about">

                        <ul id="about-list">
                        
                            <h3>About Product</h3>
                            {details["amazon_data"]?.["about"]?.map((data, index) => (
                                <li key={index}>{data}</li>
                            ))}
                        </ul>
                        <table className="about-table">
                            <h3>Technical Details</h3>
                            <tbody>
                                {details["amazon_data"]?.["details"]?.map((data, index) => (
                                    <tr key={index}>
                                        <th>{data["th"]}</th>
                                        <td>{data["tr"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                )
            }
        </>
    );
}

export default ProductDetails;
