import React from 'react';
import './App.css';

/* navbar includes login */
function Navbar() {
  return (
    <nav>
      <div className="left-nav">
        <h1>Spin N' Stone</h1>
      </div>
      <button className="login-btn">Login</button>
    </nav>
  );
}

/* styling items on the left hand side */
function Item(props) {
  return (
    <div className="item" style={{ backgroundColor: props.color }}>
      <h2>{props.name}</h2>
    </div>
  );
}

function Order() {
  return (
    <div className="order-box">
      <div className='items'>
        <div className="item-box">
          <Item name="Sauce" />
          <Item name="Cheese" />
          <Item name="Topping" />
          <Item name="Drizzle" />
          <Item name="Drink" />
          <Item name="Dough" />
          <Item name="Seasonal" />
        </div>
      </div>
      <div className="options">
      </div>
    </div>
  );
}

function Cart() {
  return (
    <div className="cart-box">
      <h1>Cart</h1>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="box-container">
        {Order()}
        {Cart()}
      </div>
    </div>
  );
}