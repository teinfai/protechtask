// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShoppingPage from './components/Shopping.js';
import Cart from './components/Cart.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/cart" element={<Cart />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
