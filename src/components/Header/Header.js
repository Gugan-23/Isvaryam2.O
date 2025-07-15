import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import classes from './header.module.css';

import RegisterModal from '../RegisterModal/RegisterModal';
import LoginModal from '../LoginModal/LoginModal';
export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setMenuOpen(open => !open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && !event.target.classList.contains(classes.hamburger)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };
  return (
    <>
      <div className={classes.offerBar}>
        🎉 Use coupon code <strong>ISVARYAM10</strong> and get 10% OFF on your first order! 🛒
      </div>

      <header className={classes.header}>
        <div className={classes.container}>
          <Link to="/" className={classes.logo}>
            <img src="/newlogo (1).png" alt="Isvaryam Logo" />
          </Link>

          <button
            className={classes.hamburger}
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            <span className={menuOpen ? classes.bar1open : ''}></span>
            <span className={menuOpen ? classes.bar2open : ''}></span>
            <span className={menuOpen ? classes.bar3open : ''}></span>
          </button>

          <nav
            ref={navRef}
            className={`${classes.nav} ${menuOpen ? classes.open : ''}`}
          >
            <ul className={classes.nav_links}>
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>


                   
              <li><Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link></li>


              {user && (
                <>
                <li>
                  <Link to="/product" onClick={() => setMenuOpen(false)}>Products</Link>
                </li>
                  <li><Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link></li>

              <li><Link to="/cart" onClick={() => setMenuOpen(false)}>My Cart</Link></li>

                  <li>

  <Link to="/profile" onClick={() => setMenuOpen(false)} className={classes.profileLink}>
    {user.name.length > 10 ? (
      <div className={classes.profileAvatar}>
        {user.name[0].toUpperCase()}
      </div>
    ) : (
      user.name
    )}
  </Link>
</li>


                  

                  <li>
                    <a onClick={() => { logout(); setMenuOpen(false); }} style={{ cursor: 'pointer' }}>
                      Logout
                    </a>
                  </li>
                </>
              )}

             {!user && (
              <>
                <li
                  
                    className={classes.authButton}
                    onClick={() => {
                      setShowLoginModal(true);
                      setMenuOpen(false);
                    }}
                  >
                    Login
                  

                </li>
                 
                
              </>
            )}

          </ul>
        </nav>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)} 
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}

        {/* Register Modal */}
        {showRegisterModal && (
          <RegisterModal 
            onClose={() => setShowRegisterModal(false)} 
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </header>
 
    </>
  );
}
