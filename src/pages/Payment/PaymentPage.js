import React, { useState, useEffect } from 'react';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';
import PaypalButtons from '../../components/PaypalButtons/PaypalButtons';
import { FaLock, FaMapMarkerAlt, FaUser, FaHome } from 'react-icons/fa';

export default function PaymentPage() {
  const [order, setOrder] = useState();

  useEffect(() => {
    getNewOrderForCurrentUser().then(data => setOrder(data));
  }, []);

  if (!order) return null;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1>Complete Your Payment</h1>
        <p>Review your order details and complete the payment to finalize your purchase</p>
      </div>
      
      <div className={classes.content}>
        <div className={classes.order_summary}>
          <h2 className={classes.section_title}>Order Summary</h2>
          
          <div className={classes.customer_info}>
            <div className={classes.info_row}>
              <div className={classes.info_label}>
                <FaUser /> Customer Name
              </div>
              <div className={classes.info_value}>{order.name}</div>
            </div>
            
            <div className={classes.info_row}>
              <div className={classes.info_label}>
                <FaHome /> Delivery Address
              </div>
              <div className={classes.info_value}>{order.address}</div>
            </div>
          </div>
          
          <h2 className={classes.section_title}>Order Items</h2>
          <OrderItemsList order={order} />
        </div>
        
        <div className={classes.map_container}>
          <div className={classes.map_header}>
            <h2 className={classes.section_title}>
              <FaMapMarkerAlt /> Delivery Location
            </h2>
          </div>
          <div className={classes.map_content}>
            <Map readonly={true} location={order.addressLatLng} />
          </div>
        </div>
      </div>
      
      <div className={classes.payment_section}>
        <h2 className={classes.payment_header}>Payment Method</h2>
        <div className={classes.payment_methods}>
          <div className={classes.paypal_container}>
            <PaypalButtons order={order} />
          </div>
        </div>
        
        <div className={classes.secure_payment}>
          <FaLock className={classes.lock_icon} />
          <span>Secure SSL Encryption • Your payment details are protected</span>
        </div>
      </div>
    </div>
  );
}