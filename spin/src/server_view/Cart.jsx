/**
 * A module representing a Pizza Builder cart.
 * @module Cart
 * @requires swr
 * @requires react
 * @requires bootstrap/dist/css/bootstrap.min.css
 * @requires react-bootstrap/Button
 * @requires react-bootstrap/Form
 * @requires axios
 * @requires '..' {HOST}
 * @requires './Cart.css'
*/
import useSWR from 'swr';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import axios from 'axios';
import { HOST } from '..';
import './Cart.css';

/**
 * Fetches the data from an API endpoint using axios.
 * @function fetcher
 * @param {string} url - API endpoint URL
 * @returns {Promise} Promise object representing the response data
*/
const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

export default function Cart(props) {
    /**
     * A functional component representing a pizza builder cart.
     * @function Cart
     * @param {Object} props - React props
     * @param {Object} props.pizza - Current pizza in the cart
     * @param {Function} props.add - Adds a new pizza to the cart
     * @param {Function} props.setPizza - Updates the current pizza in the cart
     * @param {Array} props.order - List of items in the cart
     * @param {Function} props.checkout - Callback function for checking out
     * @param {Function} props.clear - Callback function for clearing the cart
     * @param {Function} props.setOrder - Updates the current list of items in the cart
     * @returns {JSX.Element} A JSX element representing the pizza builder cart
    */
    return (
        <div className="cart-frame">
            <PizzaBuilder pizza={props.pizza} add={props.add} setPizza={props.setPizza} />
            <OrderList order={props.order} checkout={props.checkout} clear={props.clear} setOrder={props.setOrder} />
        </div>
    );
}

function PizzaContent(props) {
    /**
     * A functional component representing the pizza content section of the cart.
     * @function PizzaContent
     * @param {Object} props - React props
     * @param {Object} props.pizza - Current pizza in the cart
     * @param {Function} props.removeItem - Callback function for removing an item from the cart
     * @returns {JSX.Element} A JSX element representing the pizza content section of the cart
    */
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
    /**
     * Represents the PizzaBuilder component
     * @param {Object} props - The props object
     * @param {Object} props.pizza - The pizza object
     * @param {function} props.add - The add function
     * @param {function} props.setPizza - The setPizza function
     * @returns {JSX.Element} - The PizzaBuilder component
    */
    const { pizza, add, setPizza } = props;
    const removeItem = (item) => {
        /**
         * Removes an item from the pizza object
         * @function removeItem
         * @param {string} item - The item to be removed
        */
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
    /**
     * Represents the OrderList component
     * @param {Object} props - The props object
     * @param {Array} props.order - The order array
     * @param {function} props.setOrder - The setOrder function
     * @param {function} props.checkout - The checkout function
     * @param {function} props.clear - The clear function
     * @returns {JSX.Element} - The OrderList component
    */
    const { order } = props;
    const { data, loading, error } = useSWR('prices', fetcher);

    const removeItem = (item) => {
        /**
         * Removes an item from the order array
         * @function removeItem
         * @param {string|Object} item - The item to be removed
        */
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
        /**
         * Calculates the total price of the order
         * @function totalPrice
         * @returns {string} - The total price of the order
        */
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
        /**
         * Renders the items in the order array
         * @function renderItems
         * @returns {JSX.Element} - The list of items in the order
        */

        return order.map((item) => {
            if (typeof item === 'object') {
                return (<PizzaContent pizza={item} removeItem={() => removeItem(item)}/>);
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
