import useSWR from 'swr';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { HOST } from '..';
import './Cart.css';

const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

export default function Cart(props) {
    return (
        <div className="cart-frame">
            <PizzaBuilder pizza={props.pizza} add={props.add} setPizza={props.setPizza} />
            <OrderList order={props.order} checkout={props.checkout} clear={props.clear} setOrder={props.setOrder} />
        </div>
    );
}

function PizzaContent(props) {
    const { data, loading, error } = useSWR('menu', fetcher);
    const { pizza, removeItem } = props;


    if (loading || error || data === undefined)
        return null;

    var pizzaType;
    var pizzaCost;
    if (pizza.topping === undefined || pizza.topping.length === 0) {
        pizzaType = 'Original Cheese Pizza';
        pizzaCost = data['cheese-pizza-price']['price'];
    }
    else if (pizza.topping.length === 1) {
        pizzaType = '1 Topping Pizza';
        pizzaCost = data['one-topping-pizza-price']['price'];
    }
    else {
        pizzaType = '2-4 Topping Pizza';
        pizzaCost = data['multi-topping-pizza-price']['price'];
    }


    return (
        <div>
            <div className="price-tag-div">
                <h4>{pizzaType}</h4>
                <p>${pizzaCost}</p>
            </div>
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
            <Button variant="outline-success" onClick={add}>Add</Button>
        </div>
    );
}


function OrderList(props) {
    const { order } = props;
    const { data, loading, error } = useSWR('prices', fetcher);

    const removeItem = (item) => {
        console.log('removing' + item);
        const index = order.indexOf(item);
        if (index !== -1)
            props.setOrder([...order.slice(0, index), ...order.slice(index + 1)]);
    }

    if (loading || error || data === undefined)
        return null;

    const menuItems = {};
    data.menuitems.map(item => (
        menuItems[item.menu_item_name] = item.current_price
    ));
    const totalPrice = () => {
        var total = 0;
        order.forEach((item) => {
            if (typeof item === 'object') {
                if (item.topping === undefined || item.topping.length === 0)
                    total += Number(menuItems['Original Cheese Pizza']);
                else if (item.topping.length === 1)
                    total += Number(menuItems['1 Topping Pizza']);
                else
                    total += Number(menuItems['2-4 Topping Pizza']);
            }
            else
                total += Number(menuItems[item]);
        });
        return total.toFixed(2);
    }
    const renderItems = () => {

        return order.map((item) => {
            if (typeof item === 'object') {
                return (<PizzaContent pizza={item} removeItem={() => removeItem(item)} />);
            }
            else
                return (
                    <div onClick={() => removeItem(item)} className="price-tag-div">
                        <p>{item}</p>
                        <p>${menuItems[item]}</p>
                    </div>
                );
        });
    }

    return (
        <div className='cart-box-frame' style={{ 'height': '59.5%' }}>
            <div className="price-tag-div">
                <h2>Cart</h2>
                <p>Total: ${totalPrice()}</p>
            </div>
            <div className='cart-item-list'>
                {
                    renderItems()
                }
            </div>
            <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>
                <Button variant="outline-primary" onClick={props.checkout}>Checkout</Button>
                <Button variant="outline-danger" onClick={props.clear}>Clear</Button>
            </div>
        </div>
    );
}
