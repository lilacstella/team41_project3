import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './Cart.css';


export default function Cart(props) {
    return (
        <div className="cart-frame">
            <PizzaBuilder pizza={props.pizza} add={props.add} />
            <OrderList order={props.order} checkout={props.checkout} />
        </div>
    );
}

function AddButton(props) {
    return (
        <Button variant="outline-success" onClick={props.add}>Add</Button>
    );
}

function CheckoutButton(props) {
    return (
        <Button variant="outline-primary" onClick={props.checkout}>Checkout</Button>
    );
}

function pizzaContent(pizza) {
    const pizzaInfo = Object.keys(pizza).map(key => {
        const value = pizza[key];
        if (Array.isArray(value) && value.length === 0) {
            return null;
        } else if (value !== undefined && value !== null) {
            return <p>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</p>;
        } else {
            return null;
        }
    });

    return (
        <div>
            {pizzaInfo}
        </div>
    );
}


function PizzaBuilder(props) {
    const { pizza } = props;
    return (
        <div className='cart-pizza-box-frame'>
            <h2>Pizza Builder</h2>
            {pizzaContent(pizza)}
            <AddButton add={props.add} />
        </div>
    );
}


function OrderList(props) {
    const { order } = props;
    // console.log(order);
    return (
        <div className='cart-order-list'>
            <h2>Cart</h2>
            {
                order.map((item) => {
                    if (typeof item === 'object') {
                        return pizzaContent(item);
                    }
                    else
                        return (<p>{item}</p>);
                })
            }
            <CheckoutButton checkout={props.checkout} />
        </div>
    );
}
