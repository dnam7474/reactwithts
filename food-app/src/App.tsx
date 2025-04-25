// reactwithts/food-app/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
import { CartProvider } from './contexts/CartContext';
import './App.css';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:orderId" element={<OrderPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
};

export default App;
