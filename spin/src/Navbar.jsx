import React from 'react';
import './App.css';

/* navbar includes login */
export default function Navbar({ onLogin }) {
    return (
        <nav>
            <div className="left-nav">
                <h1>Spin N' Stone</h1>
            </div>
            <button className="login-btn" onClick={onLogin}>Login</button>
        </nav>
    );
}
