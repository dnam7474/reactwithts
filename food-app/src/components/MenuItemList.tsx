import React, { useEffect, useState } from 'react'

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageurl: string;
  }



export default function MenuItemList() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('/api/menuitems')
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json();
                setMenuItems(data);
                setLoading(false)
            } catch (err) {
                console.log('Error fetching menu items', err);
                setError('Failed to load menu items.');
                setLoading(false)
            }
        };
        fetchMenuItems();
      }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Menu</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {menuItems.map((item) => (
                <li key={item.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <img src={item.imageurl} alt={item.name} style={{ width: '150px', height: 'auto' }} />

                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p><strong>${item.price.toFixed(2)}</strong></p>
                </li>
                ))}
            </ul>
        </div>
    )
}
