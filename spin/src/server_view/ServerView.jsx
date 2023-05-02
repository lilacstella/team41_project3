/**
 * ServerView module is responsible for rendering the server view page that allows
 * the user to view and add items to their order, and complete the checkout process.
 * @module ServerView
 * @requires react
 * @requires ./Gallery
 * @requires axios
 * @requires ./Cart
 * @requires .. {HOST}
 * 
*/
import React, { useState } from 'react';
import MenuGallery, {OrderHistory} from './Gallery';
import axios from 'axios';
import Cart from './Cart';
import './ServerView.css';
import { HOST } from '..';

export default function ServerView(props) {
    /**
     * The ServerView function is the main component that renders the server view page.
     * @function ServerView
     * @param {Object} props - The props object contains the setMenuView function.
     * @returns {JSX.Element} - Returns the JSX elements for the server view page.
    */
    const [currView, setCurrView] = useState('sauce');
    const [pizza, setPizza] = useState({'topping': []});
    const [order, setOrder] = useState([]);

    const addToOrder = (item) => {
        /**
         * The addToOrder function is responsible for adding an item to the order list.
         * @function addToOrder
         * @param {Object} item - The item to be added to the order list.
         * @returns {void}
        */
        // console.log(item + " " + currView);
        if (['sauce', 'cheese', 'dough', 'topping', 'drizzle'].includes(currView)) {
            if (currView === 'topping') {
                if (pizza['topping'].length >= 4)
                    return;
                else
                    setPizza({...pizza, 'topping' : [...pizza['topping'], item]});
            }
            else
                setPizza({ ...pizza, [currView]: item });
        } else {
            setOrder([...order, item]);
        }
        // console.log(order);
        // console.log(pizza);
    }

    const addPizzaToOrder = () => {
        /**
         * The addPizzaToOrder function is responsible for adding a pizza to the order list.
         * @function addPizzaToOrder
         * @returns {void}
        */
        // if a pizza have no sauce and no cheese, not allowed
        if ((!('cheese' in pizza) || pizza['cheese'] === undefined) && (!('sauce' in pizza) && pizza['sauce'] === undefined)){
            return;
        }

        var pizzaArr = []
        for (var i = 0; i < document.getElementById('pizzaBuilderNum').value; i++){
            pizzaArr.push(pizza);
        }
        // prevent adding pizza here
        setOrder([...order, ...pizzaArr]);
        setPizza({'topping': []});
    }

    const checkoutOrder = (payment_form) => {
        /**
         * The checkoutOrder function is responsible for submitting the order for checkout.
         * @function checkoutOrder
         * @param {string} payment_form - The payment form to be used for the order.
         * @returns {void}
        */
        // formatting order
        // console.log(order);
        /* 
        {
            "order": ["Gatorade", {"sauce": "Zesty Red", "drizzle": "Ranch"}],
            "employee_id": 1,
            "payment_form": "cash",
        }

        */

        // order validation
        if (order === undefined || (Array.isArray(order) && order.length === 0)){
            return;
        }

        axios.post(HOST + 'menu', {"payment_form": payment_form, "employee_id": localStorage.getItem('employee_id'), "order": order});
        setOrder([]);
    }

    const clearOrder = () => {
        /**
         * The clearOrder function is responsible for clearing the order list and the pizza builder.
         * @function clearOrder
         * @returns {void}
        */
        setOrder([]);
        setPizza({'topping': []});
    }

    return (
        <div className="server-frame">
            <Navigation handleClick={setCurrView} setMenuView={props.setMenuView}/>
            {currView === 'order history' ? <OrderHistory /> : <MenuGallery view={currView} order={order} addToOrder={addToOrder} pizza={pizza}/>}
            <Cart order={order} pizza={pizza} add={addPizzaToOrder} checkout={checkoutOrder} clear={clearOrder} setOrder={setOrder} setPizza={setPizza}/>
        </div>
    )
}

// can be hidden in server view
function Navigation(props) {
    /**
     * Renders a navigation bar for the Server View page.
     * @param {Object} props - The props object containing the handleClick and setMenuView functions.
     * @returns {JSX.Element} The navigation bar component.
    */
    // handling the click for each tab
    return (
        <div className="server-view-tab-frame">
            <Tab name="Sauce" switchTab={props.handleClick} />
            <Tab name="Cheese" switchTab={props.handleClick} />
            <Tab name="Topping" switchTab={props.handleClick} />
            <Tab name="Drizzle" switchTab={props.handleClick} />
            <Tab name="Drink" switchTab={props.handleClick} />
            <Tab name="Dough" switchTab={props.handleClick} />
            <Tab name="Seasonal" switchTab={props.handleClick} />
            <Tab name="Order History" switchTab={props.handleClick} />
            <Tab name="Menu View" switchTab={props.setMenuView} />
        </div>
    );
}

function Tab(props) {
    /**
     * Renders a single tab in the navigation bar.
     * @param {Object} props - The props object containing the name, color, and switchTab function.
     * @returns {JSX.Element} The tab component.
    */
    return (
        <div className="server-view-tab" style={{ backgroundColor: props.color }} onClick={() => props.switchTab(props.name.toLowerCase())}>
            <h2>{props.name}</h2>
        </div>
    );
}
