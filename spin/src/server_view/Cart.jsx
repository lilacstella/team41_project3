import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import './Cart.css';


export default function Cart(props) {
    return (
        <div className="cart-frame">
            <PizzaBuilder pizza={props.pizza} add={props.add} setPizza={props.setPizza} />
            <OrderList order={props.order} checkout={props.checkout} clear={props.clear} setOrder={props.setOrder} />
        </div>
    );
}

function PizzaContent(props) {
    const { pizza, removeItem } = props;
    var pizzaType;
    if (pizza.topping === undefined || pizza.topping.length === 0)
        pizzaType = 'Original Cheese Pizza';
    else if (pizza.topping.length === 1)
        pizzaType = '1 Topping Pizza';
    else
        pizzaType = '2-4 Topping Pizza';

    return (
        <div>
            <h4>{pizzaType}</h4>
            {
                Object.keys(pizza).map(key => {
                    const value = pizza[key];
                    if (Array.isArray(value)) {
                        if (value.length === 0)
                            return null;
                        else
                            return <p onClick={() => removeItem('topping')}>&emsp;&emsp;Topping: {value.join(', ')}</p>;
                    } else if (value !== undefined && value !== null) {
                        return <p onClick={() => removeItem(key)}>&emsp;&emsp;{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</p>;
                    } else {
                        return null;
                    }
                })
            }
        </div>
    );
}


function PizzaBuilder(props) {
    const { pizza, add, setPizza } = props;
    const removeItem = (item) => {
        if (item === 'topping')
            setPizza({ ...pizza, [item]: pizza[item].slice(0, -1) });
        else
            setPizza({ ...pizza, [item]: undefined });
    }

    return (
        <div className='cart-box-frame builder'>
            <h2>Pizza Builder</h2>
            <div className="cart-item-list">
                <PizzaContent pizza={pizza} removeItem={removeItem} />
            </div>
            <div className='pizza-builder-buttons'>
                <Form.Control className='numform' id='pizzaBuilderNum' defaultValue={1} type='number'/>
                <Button variant="outline-success" onClick={add}>Add</Button>
            </div>
        </div>
    );
}


function OrderList(props) {
    const { order } = props;

    const removeItem = (item) => {
        console.log('removing' + item);
        const index = order.indexOf(item);
        if (index !== -1)
            props.setOrder([...order.slice(0, index), ...order.slice(index + 1)]);
    }

    const renderItems = () => {

        return order.map((item) => {
            if (typeof item === 'object') {
                return (<PizzaContent pizza={item} removeItem={() => removeItem(item)}/>);
            }
            else
                return (<p onClick={() => removeItem(item)}>{item}</p>);
        });
    }

    return (
        <div className='cart-box-frame' style={{ 'height': '59.5%' }}>
            <h2>Cart</h2>
            <div className='cart-item-list'>
                {
                    renderItems()
                }
            </div>
            <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>
                <div style={{'display': 'flex', 'flexDirection': 'column'}}>
                    <Button variant="outline-primary" onClick={() => props.checkout('Cash')}>Cash</Button>
                    <Button variant="outline-primary" onClick={() => props.checkout('Credit')}>Credit</Button>
                    <Button variant="outline-primary" onClick={() => props.checkout('Debit')}>Debit</Button>
                </div>
                <Button variant="outline-danger" onClick={props.clear}>Clear</Button>
            </div>
        </div>
    );
}
