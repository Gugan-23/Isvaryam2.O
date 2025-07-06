import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Price from '../../components/Price/Price';
import Title from '../../components/Title/Title';
import { useCart } from '../../hooks/useCart';
import { FaTrash, FaLock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import classes from './cartPage.module.css';

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const [showSummary, setShowSummary] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff'); // Default white

  useEffect(() => {
    axios.get('https://admin-isvaryam.onrender.com/colorcart')
      .then((res) => setBgColor(res.data.color))
      .catch((err) => console.error('Error fetching background color:', err));
  }, []);

  const totalPrice = cart.totalPrice;
  const discount = Math.floor(totalPrice * 0.05);
  const prepaidDiscount = Math.floor((totalPrice - discount) * 0.02);
  const toPay = Math.floor((totalPrice - discount) - prepaidDiscount);
  const savings = discount + prepaidDiscount;

  return (  
    <div className={classes.cart_wrapper} style={{ backgroundColor: bgColor }}>
      <Title title="Your Cart" fontSize="1.5rem" />

      {cart.items.length === 0 ? (
        <div className={classes.empty_cart}>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/" className={classes.shop_button}>Start Shopping</Link>
        </div>
      ) : (
        <>
          <div className={classes.cart_items}>
            {cart.items.map(item => (
              item.food && (
                <div key={item.food._id + item.size} className={classes.cart_item}>
                  <img src={item.food.images?.[0]} alt={item.food.name} className={classes.product_img} />
                  <div className={classes.cart_info}>
                    <h4>{item.food.name} <span className={classes.size}>({item.size})</span></h4>
                    <div className={classes.price_qty}>
                      <Price price={item.price} />
                      <div className={classes.qty}>
                        <button
                          onClick={() => changeQuantity(item, item.quantity - 1)}
                          disabled={item.quantity === 1}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => changeQuantity(item, item.quantity + 1)}
                        >+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.food._id, item.size)} className={classes.remove_btn}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>

          {showSummary && (
            <div className={classes.summary_box}>
              <h4>Price Summary</h4>
              <div className={classes.row}><span>Order Total</span><span>₹{totalPrice}</span></div>
              <div className={classes.row}><span>Items Discount</span><span>− ₹{discount}</span></div>
              <div className={classes.row}><span>Shipping</span><span><s>₹49</s></span></div>
              <div className={classes.row}><span>2% Prepaid Discount</span><span>− ₹{prepaidDiscount}</span></div>
              <div className={classes.total}><strong>To Pay</strong><strong>₹{toPay}</strong></div>
              <div className={classes.savings}>🎉 You saved ₹{savings} on this order!</div>
              <div className={classes.payment_icons}>
                <img src="/images/visa.png" alt="visa" />
                <img src="/images/mastercard.png" alt="mastercard" />
                <img src="/images/upi.png" alt="upi" />
                <img src="/images/rupay.png" alt="rupay" />
                <img src="/images/netbanking.png" alt="net banking" />
              </div>
              <div className={classes.secure}><FaLock /> 100% secured payments</div>
            </div>
          )}

          <div className={classes.checkout_footer}>
            <div onClick={() => setShowSummary(!showSummary)} className={classes.amount_toggle}>
              ₹{toPay.toLocaleString()} {showSummary ? <FaChevronDown /> : <FaChevronUp />}
            </div>
            <Link to="/checkout" className={classes.checkout_btn}>Continue</Link>
          </div>
        </>
      )}
    </div>
  );
}