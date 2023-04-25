import React, { useState } from 'react';
import MenuGallery from './Gallery';
import axios from 'axios';
import Cart from './Cart';
import './PurchaseView.css';

export default function PurchaseView() {
    const [currView, setCurrView] = useState('sauce');
    const [pizza, setPizza] = useState({'topping': []});
    const [order, setOrder] = useState([]);

    const addToOrder = (item) => {
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
        setOrder([...order, pizza]);
        setPizza({'topping': []});
    }

    const checkoutOrder = () => {
        // formatting order
        // console.log(order);
        /* 
        {
            "order": ["Gatorade", {"sauce": "Zesty Red", "drizzle": "Ranch"}],
            "employee_id": 1,
            "payment_form": "cash",
        }

        */
        axios.post('http://localhost:5000/menu', {"payment_form": "cash", "employee_id": 0, "order": order});
        setOrder([]);
        alert('Order placed!');
    }

    const clearOrder = () => {
        setOrder([]);
        setPizza({'topping': []});

        alert('Order cleared!');
    }

    return (
        <div className="purchase-frame">
            <Navigation handleClick={setCurrView}/>
            <MenuGallery view={currView} order={order} addToOrder={addToOrder} pizza={pizza}/>
            <Cart order={order} pizza={pizza} add={addPizzaToOrder} checkout={checkoutOrder} clear={clearOrder} setOrder={setOrder} setPizza={setPizza}/>
        </div>
    )
}

// can be hidden in server view
function Navigation(props) {
    // handling the click for each tab
    return (
        <div className="purchase-view-tab-frame">
            <Tab name="Sauce" switchTab={props.handleClick} />
            <Tab name="Cheese" switchTab={props.handleClick} />
            <Tab name="Topping" switchTab={props.handleClick} />
            <Tab name="Drizzle" switchTab={props.handleClick} />
            <Tab name="Drink" switchTab={props.handleClick} />
            <Tab name="Dough" switchTab={props.handleClick} />
            <Tab name="Seasonal" switchTab={props.handleClick} />
        </div>
    );
}

function Tab(props) {
    return (
        <div className="purchase-view-tab" style={{ backgroundColor: props.color }} onClick={() => props.switchTab(props.name.toLowerCase())}>
            <h2>{props.name}</h2>
        </div>
    );
}
