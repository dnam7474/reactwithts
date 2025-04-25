import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Dinner and a Movie</Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>
             <Link to="/checkout">
                Checkout {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
             </Link>
           </li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/login">Login</Link></li>
          {/* <li><Link to="/register">Register</Link></li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
