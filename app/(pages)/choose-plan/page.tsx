
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const ChoosePlanPage = () => {
  const handleCheckout = async (priceId) => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

const ChoosePlanPage = () => {
  return (
    <div className="choose-plan-page">
      <h1>Choose Your Plan</h1>
      <div className="plans">
        <div className="plan">
          <h2>Basic</h2>
          <p className="price">$9.99/month</p>
          <ul>
            <li>Access to a limited number of books</li>
            <li>Read on one device</li>
          </ul>
          <button onClick={() => handleCheckout('YOUR_STRIPE_PRICE_ID_BASIC')}>Choose Plan</button>
        </div>
        <div className="plan premium">
          <h2>Premium</h2>
          <p className="price">$19.99/month</p>
          <ul>
            <li>Unlimited access to all books</li>
            <li>Read on multiple devices</li>
            <li>Offline reading</li>
          </ul>
          <button onClick={() => handleCheckout('YOUR_STRIPE_PRICE_ID_PREMIUM')}>Choose Plan</button>
        </div>
        <div className="plan for-business">
          <h2>For Business</h2>
          <p className="price">Contact Us</p>
          <ul>
            <li>All Premium features</li>
            <li>Team management</li>
            <li>Dedicated support</li>
          </ul>
          <button>Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlanPage;
