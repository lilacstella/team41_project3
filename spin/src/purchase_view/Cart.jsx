import React from 'react';
import './Cart.css';


export default function Cart(props) {
    return (
        <div className="cart-box">
            <h1>Cart</h1>

            <OrderList order={props.order} />

            <div className='button-container'>
                <AddButton />
                <CheckoutButton />
            </div>
        </div>
    );
}

function AddButton() {
    return (
        <button className='button-cart'>Add</button>
    );
}

function CheckoutButton() {
    return (
        <button className='button-cart'>Checkout</button>
    );
}

function OrderList(props) {
    const { order } = props;
    return (
        <div className='orders-container'>
            {
                order.map((item) => (<p>{item}</p>))
            }
        </div>
    );
}
