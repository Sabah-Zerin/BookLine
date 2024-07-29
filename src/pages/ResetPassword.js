import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../pages/Login.css'; // Reuse the same CSS file

function ResetPassword() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      return handleError('New password is required');
    }
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/auth/reset-password/${id}/${token}`;
      const result = await axios.post(url, { password });

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
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-left">
          <h2>Reset Your Password</h2>
          <p>Enter your new password below.</p>
        </div>
        <div className="login-right">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor='password'>New Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                name='password'
                placeholder='Enter new password...'
              />
            </div>
            <button type='submit'>Update Password</button>
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

export default ResetPassword;
