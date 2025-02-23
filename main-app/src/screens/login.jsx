import React from 'react';
import './pixelcanvas';
import axios from 'axios';
import './login.css';
import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const nav = useNavigate();

    const [data, setData] = useState({
      email: '',
      password: ''
    })
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [snackbarMessage, setSnackbarMessage] = useState('');



    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('http://localhost:8080/login', data)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem('email', data.email);
        localStorage.setItem('token', res.data.token);
        setSnackbarOpen(true);
        setSnackbarSeverity('success');
        setSnackbarMessage('Logged in successfully');
        setTimeout(() => {
          nav('/pdf');
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setSnackbarMessage('Invalid email or password');
      })
    }
    


    return (
      <div className="login-container">
        <div className="login-form">
          <h1 className="form-title">Welcome back!</h1>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                onChange={(e) => setData({...data, email: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                onChange={(e) => setData({...data, password: e.target.value})}
                required
              />
            </div>
            <button type='submit' className="login-button" onClick={handleSubmit}>
              Sign In
            </button>
          </form>
          <div className="additional-links">
            <Link to="/forgot-pass">Forgot password?</Link>
            <Link to="/signup">Sign up</Link>
          </div>
          
          <pixel-canvas
            data-gap="15"
            data-speed="20"
            data-colors="#e0f2fe, #7dd3fc, #0ea5e9"
          />
          
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
              {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
  );
}