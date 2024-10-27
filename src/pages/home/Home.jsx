import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import ProductCard from './ProductCard';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress'; 
import { Bars } from 'react-loader-spinner';

function Home() {
    const [amazonTaskId, setAmazonTaskId] = useState(null);
    const [flipkartTaskId, setFlipkartTaskId] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [amazonData, setAmazonData] = useState([]);
    const [flipkartData, setFlipkartData] = useState([]);
    const [keyword, setKeyword] = useState('');

    const startScraping = async () => {
        setLoading(true); 
        try {
            const response = await axios.get(`http://localhost:8000/start-scrape/?q=${keyword}`);
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
            const response = await axios.get(`http://localhost:8000/check-status/?amazon_task_id=${amazonTaskId}&flipkart_task_id=${flipkartTaskId}`);
            if (response.data.status === 'completed') {
                setStatus('completed');
                setResult(response.data.matched_products);
                setAmazonData(response.data.amazon_data);
                setFlipkartData(response.data.flipkart_data);
                setLoading(false);

                localStorage.setItem('scrapedData', JSON.stringify(response.data.matched_products));
                localStorage.setItem('amazonData', JSON.stringify(response.data.amazon_data));
                localStorage.setItem('flipkartData', JSON.stringify(response.data.flipkart_data));
            } else {
                setStatus('pending');
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

    useEffect(() => {
        const savedAmazonData = localStorage.getItem('amazonData');
        const savedFlipkartData = localStorage.getItem('flipkartData');
        const savedResult = localStorage.getItem('scrapedData');

        if (savedAmazonData) {
            setAmazonData(JSON.parse(savedAmazonData));
        }
        if (savedFlipkartData) {
            setFlipkartData(JSON.parse(savedFlipkartData));
        }
        if (savedResult) {
            setResult(JSON.parse(savedResult));
        }
    }, []);
    
    useEffect(() => {
        if (result.length > 0) {
            localStorage.setItem('scrapedData', JSON.stringify(result)); // Save the result to localStorage
        }
    }, [result]);

    const formatMemory = (value) => {
        // Display the value only if it's a number, otherwise return it directly
        return !isNaN(value) && value !== 'Unknown' ? `${value}GB` : value;
    };

    return (
        <>
            <Header />
            <main>
                <form
                    style={{
                        margin: 0,
                        padding: 0,
                        marginTop: '2rem',
                        border: 'none',
                        background: 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent the default form submission behavior
                        startScraping(); // Call the scraping function on form submission
                    }}
                >
                    <TextField 
                        id="search-box"
                        placeholder="Search for products here"
                        sx={{
                            width: "60%",
                            bgcolor: "#EDE7F6",
                            "&:hover": { bgcolor: "#EEF2F6" },
                        }}
                        variant="outlined" 
                        size="small" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <button 
                        id="search-btn" 
                        type="submit" // Change button type to submit for form submission
                        disabled={loading || !keyword} 
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Scraping'}
                    </button>
                </form>

                {loading ?   
                    <div className="spinner">
                        <Bars
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="bars-loading"
                            visible={true}
                            style={{
                                marginRight:"auto",
                                marginLeft:"auto"
                            }}
                        />
                        <p>Please wait, we are currently retrieving the product information.</p>
                    </div> 
                    :
                    <Grid 
                        sx={{ marginLeft: "auto", marginRight: "auto", marginTop: "1.5rem", width: "60%" }}
                        container spacing={3}
                    >
                        {result.length > 0 ? (
                            result.map((product, index) => (
                                <Grid size={4} key={index}>
                                    <ProductCard
                                        name={product["Flipkart Name"]}
                                        amazon_price={product["amazon_price"]}
                                        flipkart_price={product["flipkart_price"]}
                                        amazon_url={product["amazon_url"]}
                                        flipkart_url={product["flipkart_url"]}
                                        image={product["image"]}
                                        ram={product["ram"]}
                                        rom={product["rom"]}
                                        color={product["color"]}
                                    />
                                </Grid>
                            ))
                        ) : (
                            status === 'completed' && <p>No Matches found.</p>
                        )}
                    </Grid>
                }

                {/* Hide the table when loading */}
                {!loading && (amazonData.length > 0 || flipkartData.length > 0) && (
                    <table id='other-result-table' style={{ marginTop: '20px', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <caption id="other-result-title" style={{ fontWeight: "bold", textAlign: "left" }}>Other Results:</caption>
                        <thead>
                            <tr>
                                <th>Platform</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>RAM</th>
                                <th>ROM</th>
                                <th>Color</th>
                                <th>URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {amazonData.map((item, index) => (
                                <tr key={`amazon-${index}`}>
                                    <td>Amazon</td>
                                    <td>{item.name}</td>
                                    <td>{item.price.toLocaleString("en-US", { style: "currency", currency: "INR" })}</td>
                                    <td>{formatMemory(item.ram)}</td>
                                    <td>{formatMemory(item.rom)}</td>
                                    <td>{item.color}</td>
                                    <td>
                                        <button
                                            onClick={() => window.open(item.url, '_blank')}
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: '#ff9900',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            View on Amazon
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {flipkartData.map((item, index) => (
                                <tr key={`flipkart-${index}`}>
                                    <td>Flipkart</td>
                                    <td>{item.name}</td>
                                    <td>{item.price.toLocaleString("en-US", { style: "currency", currency: "INR" })}</td>
                                    <td>{formatMemory(item.ram)}</td>
                                    <td>{formatMemory(item.rom)}</td>
                                    <td>{item.color}</td>
                                    <td>
                                        <button
                                            onClick={() => window.open(item.url, '_blank')}
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: '#2874f0',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            View on Flipkart
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </>
    );
}

export default Home;
