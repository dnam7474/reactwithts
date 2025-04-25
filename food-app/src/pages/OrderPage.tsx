import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './OrderPage.module.css';

interface OrderDetails {
    id: number;
    userid: number;
    ordertime: string;
    pickuptime: string;
    tax: number;
    tip: number;
    status: string;
}

interface OrderItem {
    id: number;
    itemid: number;
    orderid: number;
    price: number;
    notes?: string;
    firstName?: string;
}

interface DisplayOrderItem extends OrderItem {
    name: string;
    imageurl?: string;
}


const OrderPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [orderItems, setOrderItems] = useState<DisplayOrderItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
        if (!orderId) {
            setError("No order ID provided.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const orderRes = await fetch(`/api/orders/${orderId}`);
            if (!orderRes.ok) throw new Error(`Failed to fetch order: ${orderRes.statusText}`);
            const orderData: OrderDetails = await orderRes.json();
            setOrder(orderData);

            const itemsRes = await fetch(`/api/items/order/${orderId}`);
            if (!itemsRes.ok) throw new Error(`Failed to fetch order items: ${itemsRes.statusText}`);
            const itemsData: OrderItem[] = await itemsRes.json();

            const menuItemsRes = await fetch('/api/menuitems');
            if (!menuItemsRes.ok) throw new Error('Failed to fetch menu items for details');
            const menuItemsData = await menuItemsRes.json();
            const menuItemsMap = new Map(menuItemsData.map((item: any) => [item.id, item]));

            const displayItems: DisplayOrderItem[] = itemsData.map(item => {
                const menuItemDetails = menuItemsMap.get(item.itemid);
                return {
                    ...item,
                    name: menuItemDetails?.name || 'Unknown Item',
                    imageurl: menuItemDetails?.imageurl
                };
            });

            setOrderItems(displayItems);

        } catch (e) {
            if (e instanceof Error) {
                setError(`Failed to load order details: ${e.message}`);
            } else {
                setError('An unknown error occurred');
            }
            console.error("Error fetching order details:", e);
        } finally {
            setLoading(false);
        }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div className={styles.errorText}>Error: {error}</div>;
    if (!order) return <div>Order not found.</div>;

    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal + order.tax + order.tip;

    return (
        <div className={styles.orderContainer}>
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <div className={styles.orderDetails}>
            <h2>Order #{order.id}</h2>
            <p><strong>Order Time:</strong> {new Date(order.ordertime).toLocaleString()}</p>
            <p><strong>Pickup Time:</strong> {new Date(order.pickuptime).toLocaleString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
        </div>

            <h3>Items Ordered:</h3>
            <ul className={styles.itemList}>
                {orderItems.map((item) => (
                    <li key={item.id} className={styles.item}>
                        <img src={item.imageurl || '/placeholder-image.jpg'} alt={item.name} className={styles.itemImage}/>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                    </li>
                ))}
            </ul>

        <div className={styles.summary}>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${order.tax.toFixed(2)}</p>
            <p>Tip: ${order.tip.toFixed(2)}</p>
            <p className={styles.totalPrice}>Total Paid: ${total.toFixed(2)}</p>
        </div>
        </div>
    );
};

export default OrderPage;
