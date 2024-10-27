import './App.css';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './pages/auth/AuthContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetails from './pages/ProductDetail/ProductDetails';
import Wishlist from './pages/Wishlist/Wishlist';
import Header from './components/header/Header';

function App() {
  return (
    <div className="App">
      
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <Home /> */}
      <AuthProvider>
        <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product-detail" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
      
      
    </div>
  );
}

export default App;
