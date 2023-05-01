/**
 * Used to display the menu items in a grid view. Also used to display the order history in a table view.
 * 
 * @module MenuGallery
 * @requires React
 * @requires swr
 * @requires axios
 * @requires ./Gallery.css
 * @requires ../manager_view/Display.css
 * @requires .. {HOST}
 * @requires react {useState}
 * @requires react-bootstrap {Button, Form, Dropdown, DropdownButton, Modal}
*/

import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import './Gallery.css';
import '../manager_view/Display.css';
import { HOST } from '..';
import { useState } from 'react';
import { Button, Form, Dropdown, DropdownButton, Modal} from 'react-bootstrap';

/**

Fetches data from server using axios
@function fetcher
@param {string} url - URL endpoint to fetch from server
@returns {Promise<object>} - Data fetched from the server
*/
const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

const ItemBox = (props) => {
    /**
     * A single menu item to display within the grid of the menu gallery
     * @function ItemBox
     * @param {object} props - The component props
     * @param {string} props.itemName - The name of the item being displayed
     * @param {string[]} props.order - The current order array
     * @param {function} props.addToOrder - Function that adds an item to the order array
     * @param {object} props.pizza - The current pizza object
     * @returns {JSX.Element} - The ItemBox component
    */
    // highlight item if it is in the order
    const {itemName, order, addToOrder, pizza} = props;
    const select = () => {
        /**
         * Adds the item to the order array when the item is clicked
         * @function select
        */
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
    /**
     * A container for a category of menu items displayed as a grid
     * @function ItemBoxes
     * @param {object} props - The component props
     * @param {object[]} props.itemNames - The array of items to display
     * @param {string} props.category - The category of items being displayed
     * @param {string[]} props.order - The current order array
     * @param {function} props.addToOrder - Function that adds an item to the order array
     * @param {object} props.pizza - The current pizza object
     * @returns {JSX.Element} - The ItemBoxes component
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
     * A container for the entire menu gallery grid
     * @function Grid
     * @param {object} props - The component props
     * @returns {JSX.Element} - The Grid component
    */
    return <div className="grid" {...props} />;
};

// can be changed to be list view or grid view
function MenuItems(props) {
    /**
     * A component that can be changed to be list view or grid view
     * @function MenuItems
     * @param {object} props - The component props
     * @param {string[]} props.itemNames - The names of the items
     * @param {string} props.category - The category of the items
     * @param {object} props.order - The current order object
     * @param {function} props.addToOrder - The function to add items to the order

@param {object} props.pizza - The current pizza object

@returns {JSX.Element} - The MenuItems component
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
     * A component that displays the menu gallery
     * @function MenuGallery
     * @param {object} props - The component props
     * @param {string} props.view - The current view (grid or list)
     * @param {object} props.order - The current order object
     * @param {function} props.addToOrder - The function to add items to the order
     * @param {object} props.pizza - The current pizza object
     * @returns {JSX.Element} - The MenuGallery component
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

// table element for OrderHistory
function OrderHistoryTable(props){
    /**
     * A component that displays a table with order history and allows the user to delete orders
     * @function OrderHistoryTable
     * @param {object} props - The component props
     * @param {string} props.date - The date of the order history to display
     * @returns {JSX.Element} - The OrderHistoryTable component
    */
    const [currNum, setCurrNum] = useState('Select Order #');
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('test');

    const { data, error, isLoading } = useSWR(`orderhistory?date=${props.date}`, fetcher);

    if (isLoading || error || data === undefined || data.length === 0) {
        return;
    }

    // sends post request to orderhistory to delete order
    const deleteOrder = () => {
        /**
         * Sends post request to orderhistory to delete order
         * @function deleteOrder
         */
        if (currNum === 'SelectOrder #'){
            setModalText("Select a valid Order Number");
            setShowModal(true);
            return;
        }
        axios.post(HOST + 'orderhistory', {'ordernumber': currNum})
        setModalText("Order Deleted");
        setShowModal(true);
    };

    let orderNums = [];
    data.map(item => orderNums.push(item['Order #']));
    orderNums.sort();

    return (
        <div className='manager-view-table-row'>
            <div className='table-container'>
                <table-md className="striped bordered hover">
                    <thead>
                        <tr>
                            {Object.keys(data[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.sort().map((item, index) => (
                            <tr key={index}>
                                {Object.keys(item).map((key) => (
                                    <td key={key}>{item[key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table-md>
            </div>

            <div className="buttons-frame">
                <DropdownButton style={{"margin-left": "20px"}} title={currNum} onSelect={num => setCurrNum(num)}>
                    <div className="dropdownmenu">
                        {orderNums.map(num => (
                            <Dropdown.Item key={num} eventKey={num}>
                                {num}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <Button variant="outline-primary" className="inventory-button" onClick={deleteOrder}>Delete</Button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText}</Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
    )
}

// Order History Tab that allows for servers to view past orders and delete them
export function OrderHistory() {
    /**
     * Order History Tab that allows for servers to view past orders and delete them
     * @function OrderHistory
     * @returns {JSX.Element} - The OrderHistory component
     */
    // use states so that variables get updated thoughout
    const [displayTable, setDisplayTable] = useState(false);
    const [dates, setDates] = useState({});

    // handles the button click
    const handleClick = () => {
        setDates({
            "date": document.getElementById('orderHistoryDate').value,
        });

        setDisplayTable(true);
    }

    return (
        <div className='order-box'>
            <h1>Order History</h1>
            <div class="orderhistory-container">
                from: <Form.Control className="forms" id="orderHistoryDate" type="date"></Form.Control>
                <Button variant="outline-success" onClick={handleClick}>Submit</Button>
            </div>
            {displayTable ? <OrderHistoryTable date={encodeURIComponent(dates.date)} /> : null}
        </div>
    )
}