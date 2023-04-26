import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import './Gallery.css';
import { HOST } from '..';


const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

const ItemBox = (props) => {
    // highlight item if it is in the order
    const {itemName, image, order, addToOrder, pizza} = props;
    const select = () => {
        addToOrder(itemName);
    }

    let classes = "menu-item-box"
    if (order.includes(itemName) || pizza['topping'].includes(itemName) || Object.values(pizza).some(val => val === itemName))
        classes += " selected";
    
    return (
        <figure className={classes} onClick={select}>
            <figcaption className="menu-item-box-caption">
                {itemName}
            </figcaption>
        </figure>
    );
};

const ItemBoxes = (props) => {
    const { itemNames, category, order, addToOrder, pizza} = props;

    return (
        <div className="menu-item-box-frame">
            {
                // itemName is Object{"category-name": }
                itemNames.map((itemName) => (
                    <ItemBox itemName={itemName[category + "-name"]} image={itemName.image} order={order} addToOrder={addToOrder} pizza={pizza}/>
                ))
            }
        </div>
    );
};

const Grid = (props) => {
    return <div className="grid" {...props} />;
};

// can be changed to be list view or grid view
function MenuItems(props) {
    const { itemNames, category, order, addToOrder, pizza } = props;

    return (
        <div className="gallery">
            <Grid>
                <ItemBoxes itemNames={itemNames} category={category} order={order} addToOrder={addToOrder} pizza={pizza}/>
            </Grid>
        </div>
    );
}

export default function MenuGallery(props) {
    // sauce, topping, cheese, drizzle, drink, dough, seasonal
    const { view, order, addToOrder, pizza } = props;
    const { data, error, isLoading } = useSWR('menu', fetcher);
    if (error || isLoading)
        return;

    // console.log(data);
    return (
        <div className="order-box">
            <MenuItems itemNames={data[view]} category={view} order={order} addToOrder={addToOrder} pizza={pizza}/>
        </div>
    );
};

export function OrderHistory() {
    return (
        <div>
            hi
        </div>
    );
}