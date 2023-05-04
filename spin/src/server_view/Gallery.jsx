import React from 'react';
import useSWR from 'swr';
import './Gallery.css';
import '../manager_view/Display.css';
import { fetcher, sender } from '..';
import { useState } from 'react';
import { Button, Form, Dropdown, DropdownButton, Modal} from 'react-bootstrap';

const ItemBox = (props) => {
    // highlight item if it is in the order
    const {itemName, order, addToOrder, pizza} = props;
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

// table element for OrderHistory
function OrderHistoryTable(props){
    const [currNum, setCurrNum] = useState('Select Order #');
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('test');

    const { data, error, isLoading } = useSWR(`orderhistory?date=${props.date}`, fetcher);

    if (isLoading || error || data === undefined || data.length === 0) {
        return;
    }

    // sends post request to orderhistory to delete order
    const deleteOrder = () => {
        if (currNum === 'SelectOrder #'){
            setModalText("Select a valid Order Number");
            setShowModal(true);
            return;
        }
        sender('orderhistory', {'ordernumber': currNum})
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