import React, { useState } from 'react';
import { useCart, CartItem } from '../contexts/CartContext';
import styles from './CheckoutPage.module.css';
import { useNavigate } from 'react-router-dom';

interface CreditCard {
    pan: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

interface OrderData {
    ordertime: string;
    pickuptime: string;
    tax: number;
    tip: number;
    pan: string;
    expiryMonth: number;
    expiryYear: number;
    status: string;
    // userid: number; // Add when auth is implemented
}

interface OrderItemData {
    itemid: number;
    price: number;
    notes?: string;
    firstName?: string;
}


const CheckoutPage: React.FC = () => {
    const { cartItems, getTotalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [creditCard, setCreditCard] = useState<CreditCard>({ pan: '', expiryMonth: '', expiryYear: '', cvv: '' });
    const [tip, setTip] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreditCard(prev => ({ ...prev, [name]: value }));
    };

    const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setTip(isNaN(value) ? 0 : value);
    };

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        updateQuantity(itemId, newQuantity);
    };

    const submitOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    if (cartItems.length === 0) {
        setError("Your cart is empty.");
        setIsSubmitting(false);
        return;
    }
    if (!creditCard.pan || !creditCard.expiryMonth || !creditCard.expiryYear || !creditCard.cvv) {
        setError("Please fill in all credit card details.");
        setIsSubmitting(false);
        return;
    }

    const orderTime = new Date().toISOString();
    const taxRate = 0.07;
    const subtotal = getTotalPrice();
    const taxAmount = subtotal * taxRate;

    const orderData: OrderData = {
        ordertime: orderTime,
        pickuptime: orderTime,
        tax: parseFloat(taxAmount.toFixed(2)),
        tip: parseFloat(tip.toFixed(2)),
        pan: creditCard.pan,
        expiryMonth: parseInt(creditCard.expiryMonth, 10),
        expiryYear: parseInt(creditCard.expiryYear, 10),
        status: 'completed'
    };

    try {
        const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) {
        throw new Error(`Failed to create order: ${orderResponse.statusText}`);
        }

        const createdOrder = await orderResponse.json();
        const orderId = createdOrder.id;

        if (!orderId) {
            throw new Error('Order created, but no ID received.');
        }

        const itemsData: OrderItemData[] = cartItems.map(item => ({
        itemid: item.id,
        price: item.price,
        }));

        const itemsResponse = await fetch(`/api/items/order/${orderId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemsData),
        });

        if (!itemsResponse.ok) {
            console.error("Order created, but failed to add items:", itemsResponse.statusText);
            throw new Error(`Failed to add items to order: ${itemsResponse.statusText}`);
        }

        clearCart();
        navigate(`/order/${orderId}`);

    } catch (e) {
        console.error("Order submission failed:", e);
        if (e instanceof Error) {
            setError(`Order submission failed: ${e.message}`);
        } else {
            setError('An unknown error occurred during order submission.');
        }
    } finally {
        setIsSubmitting(false);
    }
    };

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.07;
    const total = subtotal + tax + tip;


    return (
        <div className={styles.checkoutContainer}>
        <h1>Checkout</h1>
        {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
        ) : (
            <>
            <ul className={styles.cartList}>
                {cartItems.map((item) => (
                <li key={item.id} className={styles.cartItem}>
                    <img src={item.imageurl || '/placeholder-image.jpg'} alt={item.name} className={styles.itemImage}/>
                    <div className={styles.itemDetails}>
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                    </div>
                    <div className={styles.itemQuantity}>
                    <label>Qty:</label>
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                            className={styles.quantityInput}
                        />
                    </div>
                    <span className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>Remove</button>
                </li>
                ))}
            </ul>

            <div className={styles.summary}>
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Tax (7%): ${tax.toFixed(2)}</p>
                <div className={styles.tipInput}>
                    <label htmlFor="tip">Tip: $</label>
                    <input
                        type="number"
                        id="tip"
                        name="tip"
                        min="0"
                        step="0.01"
                        value={tip.toFixed(2)}
                        onChange={handleTipChange}
                        className={styles.tipInputField}
                    />
                </div>
                <p className={styles.totalPrice}>Total: ${total.toFixed(2)}</p>
            </div>

            <div className={styles.paymentForm}>
                <h2>Payment Details</h2>
                <input type="text" name="pan" placeholder="Card Number" value={creditCard.pan} onChange={handleInputChange} required />
                <input type="text" name="expiryMonth" placeholder="Expiry Month (MM)" value={creditCard.expiryMonth} onChange={handleInputChange} required />
                <input type="text" name="expiryYear" placeholder="Expiry Year (YYYY)" value={creditCard.expiryYear} onChange={handleInputChange} required />
                <input type="text" name="cvv" placeholder="CVV" value={creditCard.cvv} onChange={handleInputChange} required />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <button onClick={submitOrder} disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
            </>
        )}
        </div>
    );
};

export default CheckoutPage;
