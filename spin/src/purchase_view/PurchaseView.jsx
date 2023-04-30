import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import MenuGallery from './Gallery';
import axios from 'axios';
import Cart from './Cart';
import './PurchaseView.css';
import { HOST } from '..';

export default function PurchaseView(props) {
    const [currView, setCurrView] = useState('sauce');
    const [pizza, setPizza] = useState({'topping': []});
    const [order, setOrder] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [modalText, setModalText] = useState('test');

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
        // if a pizza have no sauce and no cheese, not allowed
        if ((!('cheese' in pizza) || pizza['cheese'] === undefined) && (!('sauce' in pizza) && pizza['sauce'] === undefined)){
            setModalText('Please add either cheese or sauce to your cheese pizza!');
            setShowModal(true);
            return;
        }

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

        // order validation
        if (order === undefined || (Array.isArray(order) && order.length === 0)){
            setModalText('Invalid order, please add items');
            setShowModal(true);
            return;
        }


        setModalText('Select payment method');
        setShowCheckoutModal(true);
    }

    const submitCashOrder = () => {
        axios.post(HOST + 'menu', {"payment_form": "cash", "employee_id": localStorage.getItem('employee_id'), "order": order});
        setOrder([]);
        setShowCheckoutModal(false);
    }

    const submitCreditOrder = () => {
        axios.post(HOST + 'menu', {"payment_form": "credit", "employee_id": localStorage.getItem('employee_id'), "order": order});
        setOrder([]);
        setShowCheckoutModal(false);
    }

    const submitDebitOrder = () => {
        axios.post(HOST + 'menu', {"payment_form": "debit", "employee_id": localStorage.getItem('employee_id'), "order": order});
        setOrder([]);
        setShowCheckoutModal(false);
    }

    const clearOrder = () => {
        setOrder([]);
        setPizza({'topping': []});

        setModalText('Order cleared!');
        setShowModal(true);
    }

    return (
        <div className="purchase-frame">
            <Navigation handleClick={setCurrView} setMenuView={props.setMenuView}/>
            <MenuGallery view={currView} order={order} addToOrder={addToOrder} pizza={pizza}/>
            <Cart order={order} pizza={pizza} add={addPizzaToOrder} checkout={checkoutOrder} clear={clearOrder} setOrder={setOrder} setPizza={setPizza}/>
            
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText}</Modal.Title>
                </Modal.Header>
            </Modal>

            <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={submitCashOrder}>Cash</Button>
                    <Button variant="secondary" onClick={submitCreditOrder}>Credit</Button>
                    <Button variant="secondary" onClick={submitDebitOrder}>Debit</Button>
                </Modal.Footer>
            </Modal>
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
