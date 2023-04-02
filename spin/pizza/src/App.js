import React from 'react';
import './App.css';

/* navbar includes login */
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
          <Item name="Sauce" color="black" />
          <Item name="Cheese" color="black" />
          <Item name="Topping" color="black" />
          <Item name="Drizzle" color="black" />
          <Item name="Drink" color="black" />
          <Item name="Dough" color="black" />
          <Item name="Seasonal" color="black" />
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