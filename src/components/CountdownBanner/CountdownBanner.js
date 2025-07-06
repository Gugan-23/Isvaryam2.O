import React, { useEffect, useState } from 'react';
import './countdownBanner.css';

import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
const OFFER_START_HOUR = 12; // Offer starts every day at 12 PM

const getOfferTimes = () => {
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), OFFER_START_HOUR, 0, 0);
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

  if (now.getTime() < todayStart.getTime()) {
    return { startTime: todayStart.getTime(), endTime: todayEnd.getTime() };
  }

  if (now.getTime() > todayEnd.getTime()) {
    const nextStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const nextEnd = new Date(nextStart.getTime() + 24 * 60 * 60 * 1000);
    return { startTime: nextStart.getTime(), endTime: nextEnd.getTime() };
  }

  return { startTime: todayStart.getTime(), endTime: todayEnd.getTime() };
};

const CountdownBanner = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({});
  const [status, setStatus] = useState('upcoming'); // 'upcoming' | 'running'

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const { startTime, endTime } = getOfferTimes();

      if (now < startTime) {
        setStatus('upcoming');
        setTimeLeft({});
      } else if (now >= startTime && now <= endTime) {
        const distance = endTime - now;
        setStatus('running');

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setStatus('upcoming');
        setTimeLeft({});
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStrokeDashoffset = (value, max) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    return circumference - (value / max) * circumference;
  };

   const handleShopNow = () => {
    navigate('/products'); // ✅ Navigate to your product page route
  };

  return (
    <div className="banner_wrapper">
      <div className="banner_content">
        <h2>Season's Biggest Sale | Flat 10% Off On All Products Daily!</h2>

        {status === 'upcoming' && <p>Offer starts daily at 12 PM. Stay tuned!</p>}

        {status === 'running' && (
          <>
            <p>Hurry, Offer Ends In:</p>
            <div className="timer_wrapper">
              {['hours', 'minutes', 'seconds'].map((unit) => {
                const value = timeLeft[unit] || 0;
                const max = unit === 'hours' ? 24 : 60;
                const color =
                  unit === 'hours'
                    ? '#4ade80'
                    : unit === 'minutes'
                    ? '#facc15'
                    : '#f87171';

                return (
                  <div className="circle_timer" key={unit}>
                    <svg className="circle" width="50" height="50">
                      <circle
                        className="circle-bg"
                        cx="25"
                        cy="25"
                        r="18"
                        stroke="#2d2d2d"
                        strokeWidth="5"
                        fill="none"
                      />
                      <circle
                        className="circle-progress"
                        cx="25"
                        cy="25"
                        r="18"
                        stroke={color}
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={getStrokeDashoffset(value, max)}
                        strokeLinecap="round"
                        transform="rotate(-90 25 25)"
                      />
                    </svg>
                    <div className="time_value">{String(value).padStart(2, '0')}</div>
                    <span className="time_label">{unit.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
       <div className="cta_button">
          {status === 'running' ? (
            <button onClick={handleShopNow}>Shop Now</button> // ✅ Add click handler
          ) : (
            <button disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              Coming Soon
            </button>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default CountdownBanner;
