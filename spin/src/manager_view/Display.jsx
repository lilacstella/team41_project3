/**
 * Module representing the Display component for the Manager view in a web app.
 * @module Display
 * @requires React
 * @requires react-bootstrap/Modal
 * @requires react-bootstrap/Button
 * @requires swr
 * @requires axios
 * @requires react-bootstrap/Dropdown
 * @requires react-bootstrap/DropdownButton
 * @requires react-bootstrap/Form
 * @requires ../HOST
*/

import React, { useState } from 'react';
import './Display.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import useSWR from 'swr';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from "react-bootstrap/Form";

import { HOST } from '..';

/**
 * Fetches data from a specified URL using axios.
 * @function fetcher
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise} A promise that resolves to the data fetched from the URL.
*/
const fetcher = (url) => axios.get(HOST + url).then(res => res.data);

export default function Display(props) {
    /**
     * A functional component that renders the Manager view display.
     * @function Display
     * @param {object} props - The props object that contains the current view to render.
     * @returns {JSX.Element} A React component that renders the specified view.
    */
    return (
        <div className="manager-view-display-frame">
            {props.view === 'inventory' ? (
                <Inventory />
            ) : props.view === 'x-report' ? (
                <XReport />
            ) : props.view === 'z-report' ? (
                <ZReport />
            ) : props.view === 'prices' ? (
                <Prices />
            ) : props.view === 'sales-report' ? (
                <SalesReport />
            ) : props.view === 'excess-report' ? (
                <ExcessReport />
            ) : props.view === 'restock-report' ? (
                <RestockReport />
            ) : props.view === 'what-sells' ? (
                <WhatSells />
            ) : (
                <h1>Welcome Manager, click a button to get started!</h1>
            )}
        </div>
    );
}

function Inventory() {
    /**
     * A functional component that renders the Inventory view.
     * @function Inventory
     * @returns {JSX.Element} A React component that renders the Inventory view.
    */
    const [currItem, setCurrItem] = useState("Select Item");
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('test');

    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('inventory', fetcher);
    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }

    const processedData = JSON.parse(data);
    // console.log(processedData);

    let inventoryItems = [];
    processedData.map(item => inventoryItems.push(item["Inventory Item"]));
    inventoryItems.sort();

    const restockAll = () => {
        axios.post(HOST + 'inventory', {})
        setModalText('Restocked All Items!');
        setShowModal(true);
    };

    const setQuantity = () => {
        axios.post(HOST + 'inventory', { 'InventoryItem': currItem, 'Quantity': document.getElementById('restockAmount').value})
        setModalText('Set ' + currItem + " to " + Math.abs(parseInt(document.getElementById('restockAmount').value)));
        setShowModal(true);
    };

    return (
        <div className='inventory-frame'>
            <h1>Inventory</h1>
            <div className="manager-view-table-row">
                <DataTable processedData={processedData} />
            </div>
            <div className="buttons-frame">
                <Button variant="outline-success" className="inventory-button" onClick={restockAll}>Restock All</Button>
                <DropdownButton style={{"margin-left": "20px"}} title={currItem} onSelect={name => setCurrItem(name)}>
                    <div className="dropdownmenu">
                        {inventoryItems.map(name => (
                            <Dropdown.Item key={name} eventKey={name}>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <Form.Control className="numforms" id="restockAmount" type="number" placeholder="Quantity" />
                <Button variant="outline-primary" className="inventory-button" onClick={setQuantity}>Set Quantity</Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText}</Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
    )
}

function XReport() {
    /**
    * Returns the X Report component, which displays the daily sales data
    * @function XReport
    * @returns {JSX.Element} - The X Report component
    */
    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('xreport', fetcher);
    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }

    // checks for empty queries and doesn't display table
    if (data.salesdata.length === 0) {
        return (
            <div>
                <h1>X Report</h1>
                <h2>There are no data for today.</h2>
            </div>
        )
    }
    // console.log(data);

    return (
        <div>
            <h1>X Report</h1>
                <div className="manager-view-table-row">
                    <DataTable processedData={data.salesdata} />
                </div>
            <h2>Total: ${data.total}</h2>
        </div>
    )
}


function ZReport() {
    /**
     * Returns the Z Report component, which displays the sales data for the day and allows the user to reset the sales data
     * @function ZReport
     * @returns {JSX.Element} - The Z Report component
     */
    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('zreport', fetcher);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('test');

    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }


    const handleReset = async () => {
        // send post request
        axios.post(HOST + 'zreport', {});

        setModalText('Reseted Z Report!');
        setShowModal(true);
    };

    // checks for empty queries and doesn't display table
    if (data.salesdata.length === 0) {
        return (
            <div>
                <h1>Z Report</h1>
                <h2>There are no data for today.</h2>
            </div>
        )
    }
    // console.log(data);
    // console.log(data.salesdata[0]);

    return (
        <div>
            <h1>Z Report</h1>
            <div className="manager-view-table-row">
                <DataTable processedData={data.salesdata}/>
            </div>
            <h2>Total: ${data.total}</h2>
            <button className="reset-button" onClick={handleReset}>Reset Sales</button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText}</Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
    )
}

function Prices() {
    /**
     * Returns the Prices component, which displays the menu items, inventory items, and allows the user to change prices, add menu items and inventory items, and change inventory item images
     * @function Prices
     * @returns {JSX.Element} - The Prices component
     */
    const [currPrice, setCurrPrice] = useState("0.00");
    const [currItem, setCurrItem] = useState("Select Item");
    const [category, setCategory] = useState("Item Type");
    const [storage, setStorage] = useState("Item Storage");
    const [currInvItem, setInvItem] = useState("Select Item");

    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('test');

    const { data:menuData, error:error1, isLoading:isLoading1 } = useSWR('prices', fetcher);

    const { data:inventoryData, error:error2, isLoading:isLoading2 } = useSWR('inventory', fetcher);

    if (error1) {
        console.error(error1);
    }

    if (isLoading1 || error1 || menuData === undefined) {
        return;
    }

    if (error2) {
        console.error(error2);
    }

    if (isLoading2 || error2 || inventoryData === undefined) {
        return;
    }

    const handleNewPrice = async () => {
        // send post request
        axios.post(HOST + 'prices', 
        {'action': 'change_price', 'price': document.getElementById('newPrice').value, 'menuitem': currItem});
        
        setModalText(currItem + "'s Price has been changed to $" + document.getElementById('newPrice').value);
        setShowModal(true);
    };

    const handleNewMenu = async () => {
        // send post request
        axios.post(HOST + 'prices', 
        {'action': 'add_menu_item', 'menuitem': document.getElementById('newMenuItemName').value, 'price': document.getElementById('newMenuItemPrice').value});
        
        setModalText('New Menu Item: ' + document.getElementById('newMenuItemName').value + ' added with price: $' + document.getElementById('newMenuItemPrice').value);
        setShowModal(true);
    };

    const handleNewInventory = async () => {
        // send post request
        axios.post(HOST + 'prices', 
        {'action': 'add_inv_item', 'inventoryitem': document.getElementById('newInventoryItemName').value, 
         'category': category, 'quantity': document.getElementById('newInventoryItemAmount').value, 
         'units': document.getElementById('newInventoryItemUnits').value, 'storagelocation': storage});
        
        setModalText('New Inventory Item: ' + document.getElementById('newInventoryItemName').value + ' added.');
        setShowModal(true);
    };

    const handleNewImage = async () => {
        // send post request
        axios.post(HOST + 'prices', 
        {'action': 'add_image', 'item_name': currInvItem, 'img_url': document.getElementById('newInventoryItemLink').value});

        setModalText('Image changed for: ' + currInvItem);
        setShowModal(true);
    };

    // console.log(menuData);

    var menuItems = {};
    menuData.menuitems.map(item => (
        menuItems[item.menu_item_name] = item.current_price
    ));
    const sortedMenu = Object.entries(menuItems)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    let inventoryItems = [];
    JSON.parse(inventoryData).map(item => inventoryItems.push(item['Inventory Item']));
    inventoryItems.sort();
    // console.log(menuItems);
    
    return (
        <div className="prices-page">
            <h1>Prices</h1>
            <div className="prices-container">
                <label>Item to Change: </label>
                <DropdownButton className="selectBox" title={currItem} id="changePriceName" onSelect={name => {setCurrItem(name); setCurrPrice(menuItems[name])}}>
                    <div className="dropdownmenu">
                        {Object.keys(sortedMenu).map(name => (
                            <Dropdown.Item key={name} eventKey={name}>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <label>Curr Price: ${currPrice}</label>
                <Form.Control className="numforms" id="newPrice" type="number" placeholder="New Price"></Form.Control>
                <Button variant="outline-success" onClick={handleNewPrice}>Submit</Button>
            </div>

            <div className="prices-container">
                <label>New Menu Item: </label>
                <Form.Control className="forms" id="newMenuItemName" placeholder="Item Name"></Form.Control>
                <Form.Control className="numforms" id="newMenuItemPrice" type="number" placeholder="Price"></Form.Control>
                <Button variant="outline-success" onClick={handleNewMenu}>Submit</Button>
            </div>

            <div className="prices-container">
                <label>New Inventory Item: </label>
                <Form.Control className="forms" id="newInventoryItemName" placeholder="Item Name"></Form.Control>
                <DropdownButton className="selectBox" title={category} onSelect={name => setCategory(name)}>
                    <div className="dropdownmenu">
                        {menuData.categories.sort().map(name => (
                            <Dropdown.Item key={name} eventKey={name}>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <DropdownButton className="selectBox" title={storage} onSelect={name => setStorage(name)}>
                    <div className="dropdownmenu">
                        {menuData.storage.sort().map(name => (
                            <Dropdown.Item key={name} eventKey={name}>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <Form.Control className="numforms" id="newInventoryItemAmount" type="number" placeholder="Amount"></Form.Control>
                <Form.Control className="forms" id="newInventoryItemUnits" placeholder="Units"></Form.Control>
                <Button variant="outline-success" onClick={handleNewInventory}>Submit</Button>
            </div>
            
            <div className="prices-container">
                <label>Upload Image: </label>
                <DropdownButton className="selectBox" title={currInvItem} id="changeImage" onSelect={name => setInvItem(name)}>
                    <div className="dropdownmenu">
                        {inventoryItems.map(name => (
                            <Dropdown.Item key={name} eventKey={name}>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <Form.Control className="linkforms" id="newInventoryItemLink" placeholder="Link"></Form.Control>
                <Button variant="outline-success" onClick={handleNewImage}>Submit</Button>
            </div>
            
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText}</Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
    )
}

// setting up the table for SalesReport
function SalesReportTable(props) {
    /**
     * Displays a table of sales report data.
     * @param {Object} props - The props passed down to the component.
     * @param {string} props.fromDate - The start date of the sales report.
     * @param {string} props.toDate - The end date of the sales report.
     * @returns {JSX.Element} - The SalesReportTable component JSX.Element.
    */
    const { data, error, isLoading } = useSWR(`salesreport?date1=${props.fromDate}&date2=${props.toDate}`, fetcher);
    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }

    if (data.salesreport.length === 0) {
        return (
            <div>
                <h2>No data for this time.</h2>
            </div>
        )
    }

    // console.log(data);
    return (
        <div>
            <div className="manager-view-table-row">
                <DataTable processedData={data.salesreport} />
            </div>
            <h2>total: ${data.totalsales}</h2>
        </div>

    )
}

function SalesReport() {
    /**
     * Displays a sales report table with the selected date range.
     * @returns {JSX.Element} - The SalesReport component JSX.Element.
    */
    // use states so that variables get updated thoughout
    const [displayTable, setDisplayTable] = useState(false);
    const [dates, setDates] = useState({});

    // handles the button click
    const handleClick = () => {
        setDates({
            "fromDate": document.querySelector('#fromDate').value,
            "toDate": document.querySelector('#toDate').value
        });

        setDisplayTable(true);
    }

    return (
        <div>
            <h1>Sales Report</h1>
            <div class="sales-container">
                from: <Form.Control className="forms" id="fromDate" type="date"></Form.Control>
                to: <Form.Control className="forms" id="toDate" type="date"></Form.Control>
                <Button variant="outline-success" onClick={handleClick}>Submit</Button>
            </div>
            {displayTable ? <SalesReportTable fromDate={encodeURIComponent(dates.fromDate)}
                toDate={encodeURIComponent(dates.toDate)} /> : null}
        </div>


    )
}

function ExcessReportTable(props) {
    /**
     * Displays a table of excess report data.
     * @param {Object} props - The props passed down to the component.
     * @param {string} props.date - The date of the excess report.
     * @returns {JSX.Element} - The ExcessReportTable component JSX.Element.
    */
    const { data, error, isLoading } = useSWR(`excessreport?date=${props.date}`, fetcher);
    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined || data.length === 0) {
        return;
    }

    const processedData = JSON.parse(data);
    // console.log(processedData.excessdata);

    if (processedData.excessdata === undefined || processedData.excessdata.length === 0) {
        return (
            <div>
                <h2>No data for this time.</h2>
            </div>
        )
    }
    
    return (
        <div className='manager-view-table-row'>
            <DataTable processedData={processedData.excessdata}/>
        </div>

    )
}

function ExcessReport() {
    /**
     * Function that renders the Excess Report component.
     * @function ExcessReport
     * @returns {JSX.Element} JSX.Element representing the Excess Report component.
    */
    // use states so that variables get updated thoughout
    const [displayTable, setDisplayTable] = useState(false);
    const [dates, setDates] = useState({});

    // handles the button click
    const handleClick = () => {
        setDates({
            "date": document.querySelector('#date').value,
        });

        setDisplayTable(true);
    }

    return (
        <div>
            <h1>Excess Report</h1>
            <div class="sales-container">
                from: <Form.Control className="forms" id="date" type="date"></Form.Control>
                <Button variant="outline-success" onClick={handleClick}>Submit</Button>
            </div>
            {displayTable ? <ExcessReportTable date={encodeURIComponent(dates.date)} /> : null}
        </div>


    )
}

function RestockReport() {
    /**
     * Function that renders the Restock Report component.
     * @returns {JSX.Element} JSX.Element representing the Restock Report component.
    */
    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('restockreport', fetcher);
    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }

    const processedData = JSON.parse(data)
    // console.log(processedData);

    // checks for empty queries and doesn't display table
    if (processedData.length === 0) {
        return (
            <div>
                <h1>Restock Report</h1>
                <h2>There are no data for today.</h2>
            </div>
        )
    }
    

    return (
        <div>
            <h1>Restock Report</h1>
            <div className="manager-view-table-row">
                <DataTable processedData={processedData}/>  
            </div>
        </div>
    )
}

function WhatSellsTable(props) {
    /**
     * Function that renders the What Sells Table component.
     * @param {Object} props - The props passed to the component.
     * @param {string} props.fromDate - The start date of the report.
     * @param {string} props.toDate - The end date of the report.
     * @returns {JSX.Element} JSX.Element representing the What Sells Table component.
    */
    const { data, error, isLoading } = useSWR(`whatsells?date1=${props.fromDate}&date2=${props.toDate}`, fetcher);
    if (error) {
        console.error(error);
    }
    
    if (isLoading || error || data === undefined) {
        return;
    }

    const processedData = JSON.parse(data);

    // checks for empty query
    if (processedData.length === 0) {
        return (
            <div>
                <h2>No data for this time.</h2>
            </div>
        )
    }

    // console.log(JSON.parse(data));

    return (
        <div className="manager-view-table-row">
            <div className="manager-view-table-row">
                <DataTable processedData={processedData} />
            </div>
        </div>
    )
}

function WhatSells() {
    /**
     * Function that renders the What Sells component.
     * @returns {JSX.Element} JSX.Element representing the What Sells component.
    */
    // use states so that variables get updated thoughout
    const [displayTable, setDisplayTable] = useState(false);
    const [dates, setDates] = useState({});

    // handles the button click
    const handleClick = () => {
        setDates({
            "fromDate": document.querySelector('#fromDate').value,
            "toDate": document.querySelector('#toDate').value
        });

        setDisplayTable(true);
    }

    // console.log(dates.fromDate);
    // console.log(dates.toDate);

    return (
        <div>
            <h1>What Sells</h1>
            <div class="sales-container">
                from: <Form.Control className="forms" id="fromDate" type="date"></Form.Control>
                to: <Form.Control className="forms" id="toDate" type="date"></Form.Control>
                <Button variant="outline-success" onClick={handleClick}>Submit</Button>
            </div>
            {displayTable ? <WhatSellsTable fromDate={encodeURIComponent(dates.fromDate)}
                toDate={encodeURIComponent(dates.toDate)} /> : null}
        </div>


    )
}

function DataTable(props) {
    /**
     * DataTable component that renders a table with the provided data.
     * @param {Object} props - The props object for DataTable component.
     * @param {Array<Object>} props.processedData - The processed data to be displayed in the table.
     * @returns {JSX.Element} The DataTable component.
    */
    return (
        <div className='table-container'>
            <table-md className="striped bordered hover">
                <thead>
                    <tr>
                        {Object.keys(props.processedData[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.processedData.sort().map((item, index) => (
                        <tr key={index}>
                            {Object.keys(item).map((key) => (
                                <td key={key}>{item[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table-md>
        </div>
    )
}