import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import React, { useEffect } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PaypalButtons({ order }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          'AZvhPD2YvIfWr_OdluJ5izlWFDta-D6LN8BHI-3nCG_XK3S5u_cJ9VP0yIRrCA7HaZ8prBX4j8w299dk',
        currency: 'INR', // ✅ Set currency at the provider level too
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

  useEffect(() => {
    isPending ? showLoading() : hideLoading();
  }, [isPending, showLoading, hideLoading]);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'INR', // ✅ Change to INR
            value: order.totalPrice,
          },
        },
      ],
    });
  };

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

  const onError = () => {
    toast.error('Payment Failed');
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}
