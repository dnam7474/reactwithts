import React from 'react';
import MenuItems from '../components/MenuItems';
import { useCart } from '../contexts/CartContext';

const HomePage: React.FC = () => {
    const { addToCart } = useCart();

    return (
        <div>
        <h1>Menu</h1>
        <MenuItems addToCart={addToCart} />
        </div>
    );
};

export default HomePage;
