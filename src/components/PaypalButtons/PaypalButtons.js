import React, { useEffect, useState } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PaypalRedirectCheckout({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [inrToUsdRate, setInrToUsdRate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch INR → USD conversion rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          'https://api.exchangerate.host/latest?base=INR&symbols=USD'
        );
        const data = await res.json();
        if (data?.rates?.USD) {
          setInrToUsdRate(data.rates.USD);
        } else {
          toast.error('Failed to fetch currency rate');
        }
      } catch (error) {
        console.error(error);
        toast.error('Currency conversion API error');
      }
    };
    fetchRate();
  }, []);

  const handleCheckout = async () => {
    if (!inrToUsdRate) {
      toast.error('Currency rate not loaded yet');
      return;
    }
    setLoading(true);
    showLoading();

    try {
      // Convert INR to USD
      const amountUSD = (order.totalPrice * inrToUsdRate).toFixed(2);

      // Create PayPal order from your backend
      const res = await fetch('https://your-backend.com/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountUSD, currency: 'USD' }),
      });

      const data = await res.json();

      if (data?.approvalUrl) {
        // Redirect to PayPal checkout page
        window.location.href = data.approvalUrl;
      } else {
        toast.error('Failed to create PayPal order');
      }
    } catch (error) {
      console.error(error);
      toast.error('Checkout failed');
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Total: ₹{order.totalPrice}</p>
      {inrToUsdRate ? (
        <p>
          (~${(order.totalPrice * inrToUsdRate).toFixed(2)} USD will be charged)
        </p>
      ) : (
        <p>Fetching USD rate...</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={!inrToUsdRate || loading}
        style={{
          padding: '10px 20px',
          background: '#0070ba',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Pay with PayPal
      </button>
    </div>
  );
}
