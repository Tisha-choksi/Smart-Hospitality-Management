import React, { useState } from 'react';
import { loadStripe } from '@stripe/js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { apiCall } from '../api/apiClient';
import '../styles/payment.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function PaymentForm({ amount, bookingId, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Create payment intent
            const intentResponse = await apiCall('/payments/intent', 'POST', {
                amount,
                bookingId
            });

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                intentResponse.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {}
                    }
                }
            );

            if (stripeError) {
                setError(stripeError.message);
            } else if (paymentIntent.status === 'succeeded') {
                // Confirm payment on backend
                await apiCall('/payments/confirm', 'POST', {
                    paymentIntentId: paymentIntent.id,
                    amount,
                    bookingId
                });

                setSuccess('Payment successful!');
                onSuccess();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
                <label>Card Details:</label>
                <CardElement />
            </div>

            <button type="submit" className="btn btn-primary" disabled={!stripe || loading}>
                {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
        </form>
    );
}

export default function StripePayment({ amount, bookingId, onSuccess }) {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm amount={amount} bookingId={bookingId} onSuccess={onSuccess} />
        </Elements>
    );
}