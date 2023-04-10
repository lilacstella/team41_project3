import React, { useState } from 'react';
import MenuGallery from './Gallery';
import Cart from './Cart';
import './PurchaseView.css';

export default function PurchaseView() {
    const [currView, setCurrView] = useState('sauce');
    const [order, setOrder] = useState(['']);

    return (
        <div className="purchase-frame">
            <Navigation handleClick={setCurrView}/>
            <MenuGallery view={currView} order={order} setOrder={setOrder}/>
            <Cart order={order}/>
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
