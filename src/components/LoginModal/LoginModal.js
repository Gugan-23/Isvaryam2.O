import React, { useEffect,useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { EMAIL } from '../../constants/patterns';
import Button from '../Button/Button';
import classes from '../AuthModal/AuthModal.module.css';
import GoogleButton from '../GoogleButton/GoogleButton';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, login } = useAuth();
   const [googleUser, setGoogleUser] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const submit = async ({ email, password }) => {
    await login(email, password);
  };

  // Eye icon toggle for password field
  useEffect(() => {
    const setupToggle = (inputId, iconId) => {
      const input = document.getElementById(inputId);
      const icon = document.getElementById(iconId);
      if (!input || !icon) return;

      const toggle = () => {
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      };

      icon.addEventListener('click', toggle);
      return () => icon.removeEventListener('click', toggle);
    };

    const cleanup = setupToggle('password', 'eye-icon');
    return () => cleanup?.();
  }, []);


  return (
    <div className={classes.modalBackdrop} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <h2>Login</h2>
          <button className={classes.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit(submit)} className={classes.form} noValidate>
        

          <div className={classes.field}>
            <label>Email</label>
            <input
              type="email"
              {...register('email', {
                required: true,
                pattern: EMAIL,
              })}
              className={classes.input}
            />
            {errors.email && <p className={classes.error}>Enter a valid email</p>}
          </div>

          <div className={classes.field}>
            <label>Password</label>
            <div className={classes.passwordContainer}>
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: true,
                })}
                className={classes.input}
              />
              <i className="fa fa-eye" id="eye-icon"></i>
            </div>
            {errors.password && <p className={classes.error}>Password is required</p>}
          </div>

          <Button type="submit" text="Login" />

        <div style={{ textAlign: 'center', margin: '1px 0 2px 0', fontWeight: 100, color: '#888' }}>
  or
</div>

          {/* Google Sign-In Button */}
          <GoogleButton
           onSuccess={result => {
      // Get user info from Firebase result
      const user = result.user;
      const name = user.displayName;
      const email = user.email;

      // Save to localStorage for the next page
      localStorage.setItem('firebaseUser', JSON.stringify({ name, email }));

      alert('Google Sign-In successful');
      onClose();
     // navigate('/firebase-profile'); // Redirect to display page
    }}
    onError={error => {
      alert(error.message || 'Google Sign-In failed');
    }}
          />
          

          <div className={classes.switch}>
            New user?&nbsp;
            <button 
              type="button" 
              className={classes.switchButton}
              onClick={onSwitchToRegister}
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}