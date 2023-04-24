import React, { useState } from 'react';
import mutate from 'swr';
import './Display.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import useSWR from 'swr';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from "react-bootstrap/Form";

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function Display(props) {
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
    const [currItem, setCurrItem] = useState("Select Item");

    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('http://localhost:5000/inventory', fetcher);
    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }

    const processedData = JSON.parse(data);
    // console.log(processedData);

    let inventoryItems = [];
    processedData.map(item => inventoryItems.push(item.InventoryItem));

    const restockAll = () => {
        axios.post('http://localhost:5000/inventory', {})
    };

    const setQuantity = () => {
        axios.post('http://localhost:5000/inventory', { 'InventoryItem': currItem, 'Quantity': document.getElementById('restockAmount').value})
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
        </div>
    )
}

function XReport() {
    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('http://localhost:5000/xreport', fetcher);
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
            <h1>x Report</h1>
            <DataTable processedData={data.salesdata} />
            <h2>Total: ${data.total}</h2>
        </div>
    )
}


function ZReport() {
    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('http://localhost:5000/zreport', fetcher);

    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }

    const handleReset = async () => {
        // send post request
        axios.post('http://localhost:5000/zreport', {});

        mutate('http://localhost:5000/zreport');

        //window.location.reload();
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
                <DataTable processedData={data.salesdata} />
            </div>
            <h2>Total: ${data.total}</h2>
            <button className="reset-button" onClick={handleReset}>Reset Sales</button>
        </div>
    )
}

function Prices() {
    const [currPrice, setCurrPrice] = useState("null");
    const [currItem, setCurrItem] = useState("Select Item");
    const [category, setCategory] = useState("Item Type");
    const [storage, setStorage] = useState("Item Storage");
    const [currInvItem, setInvItem] = useState("Select Item");

    const { data:menuData, error:error1, isLoading:isLoading1 } = useSWR('http://localhost:5000/prices', fetcher);

    const { data:inventoryData, error:error2, isLoading:isLoading2 } = useSWR('http://localhost:5000/inventory', fetcher);

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
        axios.post('http://localhost:5000/prices', 
        {'action': 'change_price', 'price': document.getElementById('newPrice').value, 'menuitem': currItem});
    };

    const handleNewMenu = async () => {
        // send post request
        axios.post('http://localhost:5000/prices', 
        {'action': 'add_menu_item', 'menuitem': document.getElementById('newMenuItemName').value, 'price': document.getElementById('newMenuItemPrice').value});

    };

    const handleNewInventory = async () => {
        // send post request
        axios.post('http://localhost:5000/prices', 
        {'action': 'add_inv_item', 'inventoryitem': document.getElementById('newInventoryItemName').value, 
         'category': category, 'quantity': document.getElementById('newInventoryItemAmount').value, 
         'units': document.getElementById('newInventoryItemUnits').value, 'storagelocation': storage});

    };

    const handleNewImage = async () => {
        // send post request
        axios.post('http://localhost:5000/prices', 
        {'action': 'add_inv_item', 'inventoryitem': document.getElementById('newInventoryItemName').value, 
         'category': category, 'quantity': document.getElementById('newInventoryItemAmount').value, 
         'units': document.getElementById('newInventoryItemUnits').value, 'storagelocation': storage});

    };

    // console.log(menuData);

    var menuItems = {};
    menuData.menuitems.map(item => (
        menuItems[item.menu_item_name] = item.current_price
    ));

    let inventoryItems = [];
    JSON.parse(inventoryData).map(item => inventoryItems.push(item.InventoryItem));

    // console.log(menuItems);
    
    return (
        <div className="prices-page">
            <h1>Prices</h1>
            <div className="prices-container">
                <label>Item to Change: </label>
                <DropdownButton className="selectBox" title={currItem} id="changePriceName" onSelect={name => {setCurrItem(name); setCurrPrice(menuItems[name])}}>
                    <div className="dropdownmenu">
                        {Object.keys(menuItems).map(name => (
                            <Dropdown.Item key={name} eventKey={name}>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <label>Curr Price: {currPrice}</label>
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
                        {menuData.categories.map(name => (
                            <Dropdown.Item key={name} eventKey={name}>
                                {name}
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
                <DropdownButton className="selectBox" title={storage} onSelect={name => setStorage(name)}>
                    <div className="dropdownmenu">
                        {menuData.storage.map(name => (
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

        </div>
    )
}

// setting up the table for SalesReport
function SalesReportTable(props) {
    const { data, error, isLoading } = useSWR(`http://localhost:5000/salesreport?date1=${props.fromDate}&date2=${props.toDate}`, fetcher);
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
            <DataTable processedData={data.salesreport} />
            <h2>total: ${data.totalsales}</h2>
        </div>

    )
}

function SalesReport() {
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
    const { data, error, isLoading } = useSWR(`http://localhost:5000/excessreport?date=${props.date}`, fetcher);
    if (error) {
        console.error(error);
    }

    if (isLoading || error || data === undefined) {
        return;
    }

    const processedData = JSON.parse(data);
    // console.log(processedData.excessdata);

    if (processedData.excessdata.length === 0) {
        return (
            <div>
                <h2>No data for this time.</h2>
            </div>
        )
    }
    
    return (
        <div>
            <DataTable processedData={processedData.excessdata}/>
        </div>

    )
}

function ExcessReport() {
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
    // fetch information from endpoint
    const { data, error, isLoading } = useSWR('http://localhost:5000/restockreport', fetcher);
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
            <DataTable processedData={processedData}/>
        </div>
    )
}

function WhatSellsTable(props) {
    const { data, error, isLoading } = useSWR(`http://localhost:5000/whatsells?date1=${props.fromDate}&date2=${props.toDate}`, fetcher);
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
            <DataTable processedData={processedData} />
        </div>
    )
}

function WhatSells() {
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
    return (
        <div className='table-container'>
            <Table className="striped bordered hover">
                <thead>
                    <tr>
                        {Object.keys(props.processedData[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.processedData.map((item, index) => (
                        <tr key={index}>
                            {Object.keys(item).map((key) => (
                                <td key={key}>{item[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}