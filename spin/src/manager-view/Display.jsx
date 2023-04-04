import React from 'react';
import './Display.css';


export default function Display(props) {
    return (
        <div className="display-box">
            {props.view === 'inventory' ? (
                <Inventory/>
            ): props.view === 'x-report' ? (
                <XReport/>
            ): props.view === 'z-report' ? (
                <ZReport/>
            ): props.view === 'prices' ? (
                <Prices/>
            ): props.view === 'sales-report' ? (
                <SalesReport/>
            ): props.view === 'excess-report' ? (
                <ExcessReport/>
            ): props.view === 'restock-report' ? (
                <RestockReport/>
            ): props.view === 'what-sells' ? (
                <WhatSells/>
            ): (
                <h1>Welcome Manager, click a button to get started!</h1>
            )}
        </div>
    );
}

function Inventory(){
    return(
        <h1>Inventory</h1>
    )
}

function XReport(){
    return(
        <h1>X Report</h1>
    )
}

function ZReport(){
    return(
        <h1>Z Report</h1>
    )
}

function Prices(){
    return(
        <h1>Prices</h1>
    )
}

function SalesReport(){
    return(
        <h1>Sales Report</h1>
    )
}

function ExcessReport(){
    return(
        <h1>Excess Report</h1>
    )
}

function RestockReport(){
    return(
        <h1>Restock Report</h1>
    )
}

function WhatSells(){
    return(
        <h1>What Sells</h1>
    )
}