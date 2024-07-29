import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/Login.css'; // Reuse the same CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Added state for new password
  const [step, setStep] = useState(1); // To handle different steps
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleError = (message) => {
    toast.error(message);
  };

  const handleSuccess = (message) => {
    toast.success(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      // Request reset (email submission)
      if (!email) {
        return handleError('Email is required');
      }
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`;
        const result = await axios.post(url, { email });

        const { success, message, error } = result.data;
        if (success) {
          handleSuccess(message);
          setStep(2); // Proceed to the next step
        } else if (error) {
          handleError(error.details[0].message);
        } else {
          handleError(message);
        }
      } catch (err) {
        handleError(err.message);
      }
    } else if (step === 2) {
      // Reset password (new password submission)
      if (!email || !newPassword) {
        return handleError('Email and new password are required');
      }
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`;
        const result = await axios.post(url, { email, newPassword });

        const { success, message, error } = result.data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        } else if (error) {
          handleError(error.details[0].message);
        } else {
          handleError(message);
        }
      } catch (err) {
        handleError(err.message);
      }
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-left">
          <h2>No problem, reset your password</h2>
          <p>{step === 1 ? 'Enter your email to receive a password reset link.' : 'Enter your new password.'}</p>
        </div>
        <div className="login-right">
          <h1>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                onChange={handleChange}
                type='email'
                name='email'
                placeholder='Enter your email...'
                value={email}
                disabled={step === 2} // Disable email input on the second step
              />
            </div>
            {step === 2 && (
              <div>
                <label htmlFor='newPassword'>New Password</label>
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  type='password'
                  name='newPassword'
                  placeholder='Enter new password...'
                />
              </div>
            )}
            <button type='submit'>{step === 1 ? 'Send Reset Link' : 'Reset Password'}</button>
            <div className="login">
              Remember your password? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
