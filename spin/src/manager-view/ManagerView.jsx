import React, { useState } from 'react';
import Button from './Button';
import Display from './Display';
// import './ManagerView.css';

export default function ManagerView() {
    const [currView, setCurrView] = useState('display');

    const setInventoryView = () => {
        setCurrView('inventory');
    };

    const setXReportView = () => {
        setCurrView('x-report');
    };

    const setZReportView = () => {
        setCurrView('z-report');
    };

    const setPricesView = () => {
        setCurrView('prices');
    };

    const setSalesReportView = () => {
        setCurrView('sales-report');
    };
    
    const setExcessReportView = () => {
        setCurrView('excess-report');
    };

    const setRestockReportView = () => {
        setCurrView('restock-report');
    };

    const setWhatSellsView = () => {
        setCurrView('what-sells');
    };

    return (
        <div className="app-box">
            <div className="button-box">
                <Button className="button" buttonText="Inventory" view={setInventoryView}/>
                <Button className="button disabled" buttonText="X Report" view={setXReportView}/>
                <Button className="button disabled" buttonText="Z Report" view={setZReportView}/>
                <Button className="button disabled" buttonText="Prices" view={setPricesView}/>
                <Button className="button disabled" buttonText="Sales Report" view={setSalesReportView}/>
                <Button className="button disabled" buttonText="Excess Report" view={setExcessReportView}/>
                <Button className="button disabled" buttonText="Restock Report" view={setRestockReportView}/>
                <Button className="button disabled" buttonText="What Sells" view={setWhatSellsView}/>
            </div>
            <Display view={currView}/>
        </div>
    )
}