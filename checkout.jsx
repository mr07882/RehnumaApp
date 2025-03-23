import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Add this import

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const history = useHistory(); // Add this line

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleContinueShopping = () => {
        history.push('/home'); // Add this line
    };

    return (
        <div>
            <h2>Checkout</h2>
            <form>
                {/* ...existing code... */}
            </form>
            <button onClick={handleContinueShopping}>Continue Shopping</button> {/* Add this line */}
        </div>
    );
};

export default Checkout;
