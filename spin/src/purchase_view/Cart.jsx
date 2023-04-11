import React from 'react';
import './Cart.css';


export default function Cart(props) {
    return (
        <div className="cart-box">
            <h1>Cart</h1>

            <PizzaBuilder pizza={props.pizza} />
            <OrderList order={props.order} />

            <div className='button-container'>
                <AddButton add={props.add} />
                <CheckoutButton clear={props.clear} />
            </div>
        </div>
    );
}

function AddButton(props) {
    return (
        <button className='button-cart' onClick={props.add}>Add</button>
    );
}

function CheckoutButton(props) {
    return (
        <button className='button-cart' onClick={props.clear}>Checkout</button>
    );
}

function printObject(obj) {
    return JSON.stringify(obj, null, 2);
  }
  

function PizzaBuilder(props) {
    const { pizza } = props;
    return (
        <div className='pizza-builder'>
            <p>Pizza Builder</p>
            <p>{printObject(pizza)}</p>
        </div>
    );
}


function OrderList(props) {
    const { order } = props;
    // console.log(order);
    return (
        <div className='orders-container'>
            {
                order.map((item) => {
                    if (typeof item === 'object') {
                        return (
                            <p>
                                {printObject(item)}
                            </p>
                        );
                    }
                    else
                        return (<p>{item}</p>);
                })
            }
        </div>
    );
}
