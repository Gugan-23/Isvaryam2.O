import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// PayPal Buttons Wrapper
export default function PaypalButtons({ order }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          'AZvhPD2YvIfWr_OdluJ5izlWFDta-D6LN8BHI-3nCG_XK3S5u_cJ9VP0yIRrCA7HaZ8prBX4j8w299dk',
        currency: 'USD', // ✅ Must be USD since INR is not supported for most accounts
      }}
    >
      <Buttons order={order} />
    </PayPalScriptProvider>
  );
}

function Buttons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();
  const { showLoading, hideLoading } = useLoading();
  const [inrToUsdRate, setInrToUsdRate] = useState(null);

  // Show/hide loading spinner
  useEffect(() => {
    isPending ? showLoading() : hideLoading();
  }, [isPending, showLoading, hideLoading]);

  // Fetch INR → USD rate
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

  // Create PayPal order in USD
  const createOrder = (data, actions) => {
    if (!inrToUsdRate) {
      toast.error('Currency rate not loaded yet');
      return;
    }
    const amountUSD = (order.totalPrice * inrToUsdRate).toFixed(2);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amountUSD,
          },
        },
      ],
    });
  };

  // On successful payment
  const onApprove = async (data, actions) => {
    try {
      const payment = await actions.order.capture();
      const orderId = await pay(payment.id);
      clearCart();
      toast.success('Payment Saved Successfully');
      navigate('/track/' + orderId);
    } catch (error) {
      toast.error('Payment Save Failed');
    }
  };

  // On payment error
  const onError = () => {
    toast.error('Payment Failed');
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
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        disabled={!inrToUsdRate}
      />
    </div>
  );
}
