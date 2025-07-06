import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackOrderById } from '../../services/orderService';
import NotFound from '../../components/NotFound/NotFound';
import classes from './orderTrackPage.module.css';
import DateTime from '../../components/DateTime/DateTime';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';

// Order status timeline configuration
const orderTimeline = (status) => {
  const steps = [
    {
      id: 1,
      title: 'Order Placed',
      description: 'Your order has been successfully placed.',
      status: 'placed',
      active: true
    },
    {
      id: 2,
      title: 'Order Confirmed',
      description: 'We\'ve received your order and are preparing it.',
      status: 'confirmed',
      active: status !== 'NEW'
    },
    {
      id: 3,
      title: 'Payment Processed',
      description: 'Payment has been successfully processed.',
      status: 'payment',
      active: status !== 'NEW' && status !== 'CONFIRMED'
    },
    {
      id: 4,
      title: 'Shipped',
      description: 'Your order is on the way to you.',
      status: 'shipped',
      active: status === 'SHIPPED' || status === 'DELIVERED'
    },
    {
      id: 5,
      title: 'Delivered',
      description: 'Your order has been delivered successfully.',
      status: 'delivered',
      active: status === 'DELIVERED'
    }
  ];

  return steps;
};

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    orderId &&
      trackOrderById(orderId).then(order => {
        setOrder(order);
      });
  }, [orderId]);

  if (!orderId)
    return <NotFound message="Order Not Found" linkText="Go To Home Page" linkRoute="/" />;

  return (
    order && (
      <div className={classes.container}>
        <div className={classes.header}>
          <h1>Order #{order._id}</h1>
        </div>
        
        <div className={classes.content}>
          <div className={classes.card}>
            <h2 className={classes.section_title}>Order Details</h2>
            
            <div className={classes.info_grid}>
              <div className={classes.info_group}>
                <span className={classes.info_label}>Order Date</span>
                <div className={classes.info_value}>
                  <DateTime date={order.createdAt} />
                </div>
              </div>
              
              <div className={classes.info_group}>
                <span className={classes.info_label}>Customer</span>
                <div className={classes.info_value}>{order.name}</div>
              </div>
              
              <div className={classes.info_group}>
                <span className={classes.info_label}>Delivery Address</span>
                <div className={classes.info_value}>{order.address}</div>
              </div>
              
              <div className={classes.info_group}>
                <span className={classes.info_label}>Status</span>
                <div className={`${classes.info_value} ${classes.status_badge} ${classes['status_' + order.status.toLowerCase()]}`}>
                  {order.status}
                </div>
              </div>
              
              {order.paymentId && (
                <div className={classes.info_group}>
                  <span className={classes.info_label}>Payment ID</span>
                  <div className={classes.info_value}>{order.paymentId}</div>
                </div>
              )}
            </div>
            
            <h2 className={classes.section_title} style={{ marginTop: '1.5rem' }}>Order Items</h2>
            <OrderItemsList order={order} compact={true} />
            
            {order.status === 'NEW' && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link to="/payment" className={classes.payment_button}>
                  Complete Payment
                </Link>
              </div>
            )}
          </div>
          
          <div>
            <div className={classes.card}>
              <h2 className={classes.section_title}>Delivery Location</h2>
              <div className={classes.map_container}>
                <Map location={order.addressLatLng} readonly={true} />
              </div>
            </div>
            
            <div className={classes.card}>
              <h2 className={classes.section_title}>Order Progress</h2>
              <div className={classes.timeline}>
                {orderTimeline(order.status).map((step) => (
                  <div 
                    key={step.id} 
                    className={`${classes.timeline_item} ${step.active ? classes.active_step : ''}`}
                  >
                    <div className={classes.timeline_content}>
                      <div className={classes.timeline_title}>
                        {step.title}
                      </div>
                      {step.active && (
                        <div className={classes.timeline_date}>
                          {step.status === 'delivered' ? 'Delivered today' : 'Completed'}
                        </div>
                      )}
                      <div className={classes.timeline_description}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}