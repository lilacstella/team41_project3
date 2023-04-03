import React from 'react';
import './Gallery.css';

/* styling tabs on the left hand side */
function Tab(props) {
    return (
        <div className="tabs" style={{ backgroundColor: props.color }}>
            <h2>{props.name}</h2>
        </div>
    );
}

// can be hidden in server view
function Navigation() {
    return (
        <div className='tabs'>
            <div className="tab-box">
                <Tab name="Sauce" />
                <Tab name="Cheese" />
                <Tab name="Topping" />
                <Tab name="Drizzle" />
                <Tab name="Drink" />
                <Tab name="Dough" />
                <Tab name="Seasonal" />
            </div>
        </div>
    );
}

// can be changed to be list view or grid view
function MenuItems() {
    return (
        <div className="gallery">
            <p>hi</p>
        </div>
    );
}

export default function MenuView() {
    return (
        <div className="order-box">
            <Navigation />
            <MenuItems />
        </div>
    )
}