import React, { useState, useEffect } from 'react';
import styles from './MenuItems.module.css';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageurl: string;
    category: string;
    available: boolean;
}

interface MenuItemsProps {

}

const MenuItems: React.FC<MenuItemsProps> = ({ addToCart }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
        try {
            const response = await fetch('/api/menuitems');
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: MenuItem[] = await response.json();
            setMenuItems(data);
        } catch (e) {
            if (e instanceof Error) {
            setError(`Failed to fetch menu items: ${e.message}`);
            } else {
            setError('An unknown error occurred');
            }
            console.error("Error fetching menu items:", e);
        } finally {
            setLoading(false);
        }
        };

        fetchMenuItems();
    }, []);

    if (loading) {
        return <div>Loading menu...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const availableItems = menuItems.filter(item => item.available);

    return (
        <div className={styles.menuContainer}>
        {availableItems.map((item) => (
            <div key={item.id} className={styles.menuItemCard}>
            <img
                src={item.imageurl || '/placeholder-image.jpg'}
                alt={item.name}
                className={styles.menuItemImage}
                onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
            />
            <div className={styles.menuItemDetails}>
                <h3 className={styles.menuItemName}>{item.name}</h3>
                <p className={styles.menuItemDescription}>{item.description}</p>
                <div className={styles.menuItemFooter}>
                <span className={styles.menuItemPrice}>${item.price.toFixed(2)}</span>
                <button
                    className={styles.addButton}
                    onClick={() => addToCart(item)}
                >
                    Add
                </button>
                </div>
            </div>
            </div>
        ))}
        </div>
    );
};

export default MenuItems;
