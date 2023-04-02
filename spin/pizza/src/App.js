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
          <Item name="Sauce" color="gray" />
          <Item name="Cheese" color="gray" />
          <Item name="Topping" color="gray" />
          <Item name="Drizzle" color="gray" />
          <Item name="Drink" color="gray" />
          <Item name="Dough" color="gray" />
          <Item name="Seasonal" color="gray" />
        </div>
      </div>
    </div>
  );
}

function Cart() {
  return (
    <div className="cart-box">
      Cart
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