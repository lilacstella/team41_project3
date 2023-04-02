import React from 'react';
import './App.css';

function Navbar() {
  return (
    <nav>
      <div className="left-nav">
        <p>Spin N' Stone</p>
      </div>
      <button className="login-btn">Login</button>
    </nav>
  );
}

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <h1>Hello, World!</h1>
      <p>This is a gray page.</p>
    </div>
  );
}