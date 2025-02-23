import React from 'react';
import './pixelcanvas';
import './signup.css';
import { Link } from 'react-router-dom';

export default function SignUp() {
    return (
        <div className="signup-container">
            <div className="signup-form">
                <h1 className="signup-form-title">Welcome, Register Here.</h1>
                <form>
                <div className="signup-input-group">
                        <label htmlFor="first-name">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            placeholder="Enter your first name"
                            required
                        />
                    </div>
                    <div className="signup-input-group">
                        <label htmlFor="password">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div className="signup-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="signup-input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="signup-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="signup-button">
                        Sign In
                    </button>
                </form>
                <div className="signup-additional-links signup-centerdv">
                    <Link to="/signin">
                        Already have an account? Sign in
                    </Link>
                </div>
                
                    <pixel-canvas
                        data-gap="15"
                        data-speed="20"
                        data-colors="#e0f2fe, #7dd3fc, #0ea5e9"
                    />
                
            </div>
        </div>
    );
}