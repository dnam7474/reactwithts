import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './OrdersPage.module.css';

interface OrderSummary {
    id: number;
    ordertime: string;
    status: string;
    // userid: number; // Add if needed and available
}

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
                const response = await fetch('/api/orders');

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.statusText}`);
                }
                const data: OrderSummary[] = await response.json();
                data.sort((a, b) => new Date(b.ordertime).getTime() - new Date(a.ordertime).getTime());
                setOrders(data);
        } catch(e) {
                if (e instanceof Error) {
                    setError(`Failed to load orders: ${e.message}`);
                } else {
                    setError('An unknown error occurred');
                }
                console.error("Error fetching orders:", e);
        } finally {
                setLoading(false);
        }
        };

        fetchOrders();
    }, []);


    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className={styles.errorText}>Error: {error}</div>;

    return (
        <div className={styles.ordersContainer}>
        <h1>Your Orders</h1>
        {orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
        ) : (
            <ul className={styles.orderList}>
            {orders.map((order) => (
                <li key={order.id} className={styles.orderItem}>
                <Link to={`/order/${order.id}`} className={styles.orderLink}>
                    <div>Order #{order.id}</div>
                    <div>Date: {new Date(order.ordertime).toLocaleDateString()}</div>
                    <div>Status: {order.status}</div>
                </Link>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default OrdersPage;
