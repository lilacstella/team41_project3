import React from 'react';
import './Cart.css';


export default function Cart() {
    return (
        <div className="cart-box">
            <h1>Cart</h1>

            <OrderList/>

            <div className='button-container'>
                <AddButton/>
                <CheckoutButton/>
            </div>
        </div>
    );
}

function AddButton(){
    return(
        <button className='button-cart'>Add</button>
    );
}

function CheckoutButton(){
    return(
        <button className='button-cart'>Checkout</button>
    );
}

function OrderList(){
    return(
        <div className='orders-container'>
            <p>test</p>
        </div>
    );
}
