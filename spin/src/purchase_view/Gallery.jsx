/**
 * Module for displaying a menu gallery with different categories.
 * @module MenuGallery
 * @requires React
 * @requires swr
 * @requires axios
 * @requires ../constants/HOST
 * @requires ./Gallery.css
*/
import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import './Gallery.css';
import { HOST } from '..';

/**
 * Fetcher function that retrieves data from the server.
 * @function fetcher
 * @param {string} url - The URL to retrieve data from.
 * @returns {Promise} - A promise that resolves with the fetched data.
*/
const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

// maintaining aspect ratio of the image
const AspectRatio = (props) => {
    /**
     * Component that maintains the aspect ratio of an image.
     * @function AspectRatio
     * @param {object} props - The component props.
     * @param {number} props.ratio - The aspect ratio of the image.
     * @returns {JSX.Element} - The rendered component.
    */
    const { ratio = 1 / 1, ...otherProps } = props;

    return (
        <div
            className="aspect-ratio"
            style={{ paddingTop: `${100 / ratio}%` }}
            {...otherProps}
        />
    );
};

const Image = (props) => {
    /**
     * Component that displays an image.
     * @function Image
     * @param {object} props - The component props.
     * @param {string} props.image - The URL of the image to display.
     * @returns {JSX.Element} - The rendered component.
    */
    // using props for url in the future
    return (
        <div
            style={{
                backgroundImage: `url(${props.image})`,
                backgroundSize: "cover",
            }}
        />
    );
};

const ItemBox = (props) => {
    /**
     * Component that displays a menu item with a caption.
     * @function ItemBox
     * @param {object} props - The component props.
     * @param {string} props.itemName - The name of the menu item.
     * @param {string} props.image - The URL of the image of the menu item.
     * @param {string[]} props.order - The current order of menu items.
     * @param {function} props.addToOrder - The function to add an item to the order.
     * @param {object} props.pizza - The current pizza configuration.
     * @returns {JSX.Element} - The rendered component.
    */
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
            <AspectRatio>
                <Image image={image} />
            </AspectRatio>
            <figcaption className="menu-item-box-caption">
                {itemName}
            </figcaption>
        </figure>
    );
};

const ItemBoxes = (props) => {
    /**
     * Component that displays a collection of menu items.
     * @function
     * @param {object} props - The component props.
     * @param {object[]} props.itemNames - The names and images of the menu items.
     * @param {string} props.category - The category of the menu items.
     * @param {string[]} props.order - The current order of menu items.
     * @param {function} props.addToOrder - The function to add an item to the order.
     * @param {object} props.pizza - The current pizza configuration.
     * @returns {JSX.Element} - The rendered component.
    */
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
    /**
     * A React component that renders a grid with the provided props.
     * @function Grid
     * @param {Object} props - The props object that contains the props to apply to the grid.
     * @returns {JSX.Element} A React component representing the grid.
    */
    return <div className="grid" {...props} />;
};


// can be changed to be list view or grid view
function MenuItems(props) {
    /**
     * A React component that renders either a grid or a list view of menu items.
     * @function MenuItems
     * @param {Object} props - The props object that contains the following properties:
     * @param {Object[]} props.itemNames - An array of objects representing the items to display in the gallery.
     * @param {string} props.category - The category of the items to display.
     * @param {string[]} props.order - An array of strings representing the items in the order.
     * @param {function} props.addToOrder - A function that adds an item to the order.
     * @param {Object} props.pizza - An object representing the pizza with properties for sauce, cheese, toppings, etc.
     * @returns {JSX.Element} A React component representing either a grid or a list view of menu items.
    */
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
    /**
     * Renders a menu gallery component which displays the menu items in a grid layout.
     * @param {Object} props - The props object containing view, order, addToOrder, and pizza.
     * @param {string} props.view - The current view mode (sauce, topping, cheese, drizzle, drink, dough, seasonal).
     * @param {Array} props.order - The current order of menu items.
     * @param {Function} props.addToOrder - A function to add an item to the current order.
     * @param {Object} props.pizza - The current pizza object containing its toppings, cheese, drizzle, and dough.
     * @returns {JSX.Element} - A React component representing a menu gallery.
    */
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
