import React from 'react';
import './App.css';

/* navbar includes login */
export default function Navbar(props) {
    const handleClick = () => {
        props.login();
    };

    return (
        <nav>
            <div className="left-nav">
                <h1>{props.displayText}</h1>
            </div>
            <button className="login-btn" onClick={handleClick}>{props.buttonText}</button>
        </nav>
    );
}