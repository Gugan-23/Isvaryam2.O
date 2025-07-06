import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { EMAIL } from '../../constants/patterns';
import Button from '../Button/Button';
import classes from '../AuthModal/AuthModal.module.css';

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const auth = useAuth();
  const { user } = auth;
  
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submit = async data => {
    await auth.register(data);
  };

  // Eye icon toggle for both password fields
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

    const cleanup1 = setupToggle('password', 'eye-icon');
    const cleanup2 = setupToggle('confirmPassword', 'eye-icon-confirm');

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  return (
    <div className={classes.modalBackdrop} onClick={onClose}>
      <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
        <div className={classes.modalHeader}>
          <h2>Register</h2>
          <button className={classes.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit(submit)} className={classes.form} noValidate>
          <div className={classes.field}>
            <label>Name</label>
            <input
              type="text"
              {...register('name', { required: true, minLength: 5 })}
              className={classes.input}
            />
            {errors.name && <p className={classes.error}>Name must be at least 5 characters</p>}
          </div>

          <div className={classes.field}>
            <label>Email</label>
            <input
              type="email"
              {...register('email', { required: true, pattern: EMAIL })}
              className={classes.input}
            />
            {errors.email && <p className={classes.error}>Enter a valid email</p>}
          </div>
          <div className={classes.field}>
  <label>Phone Number</label>
  <input
    type="tel"
    {...register('phone', {
      required: 'Phone number is required',
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: 'Enter a valid 10-digit phone number',
      },
    })}
    className={classes.input}
  />
  {errors.phone && <p className={classes.error}>{errors.phone.message}</p>}
</div>


          <div className={classes.field}>
            <label>Password</label>
            <div className={classes.passwordContainer}>
              <input
                type="password"
                id="password"
                {...register('password', { required: true, minLength: 5 })}
                className={classes.input}
              />
              <i className="fa fa-eye" id="eye-icon"></i>
            </div>
            {errors.password && <p className={classes.error}>Password must be at least 5 characters</p>}
          </div>

          <div className={classes.field}>
            <label>Confirm Password</label>
            <div className={classes.passwordContainer}>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: true,
                  validate: value =>
                    value !== getValues('password') ? 'Passwords do not match' : true,
                })}
                className={classes.input}
              />
              <i className="fa fa-eye" id="eye-icon-confirm"></i>
            </div>
            {errors.confirmPassword && (
              <p className={classes.error}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className={classes.field}>
            <label>Address</label>
            <input
              type="text"
              {...register('address', { required: true, minLength: 10 })}
                className={`${classes.input} ${classes.addressInput}`}
            />
            {errors.address && <p className={classes.error}>Address must be at least 10 characters</p>}
          </div>

          <Button type="submit" text="Register" />

          <div className={classes.switch}>
            Already a user?&nbsp;
            <button 
              type="button" 
              className={classes.switchButton}
              onClick={onSwitchToLogin}
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}