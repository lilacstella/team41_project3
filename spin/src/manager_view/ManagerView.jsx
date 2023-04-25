import React, { useState } from 'react';
import Button from './Button';
import Display from './Display';
import './ManagerView.css';

export default function ManagerView(props) {
    const [currView, setCurrView] = useState('display');

    return (
        <div className="manager-frame">
            <div className="manager-tabs-frame">
                {/* the buttonText lowered and hyphened is passed to setCurrView */}
                <Button className="manager-button" buttonText="Inventory" view={setCurrView}/>
                <Button className="manager-button" buttonText="X Report" view={setCurrView}/>
                <Button className="manager-button" buttonText="Z Report" view={setCurrView}/>
                <Button className="manager-button" buttonText="Prices" view={setCurrView}/>
                <Button className="manager-button" buttonText="Sales Report" view={setCurrView}/>
                <Button className="manager-button" buttonText="Excess Report" view={setCurrView}/>
                <Button className="manager-button" buttonText="Restock Report" view={setCurrView}/>
                <Button className="manager-button" buttonText="What Sells" view={setCurrView}/>
                <Button className="manager-button" buttonText="Menu View" view={props.setMenuView}/>
            </div>
            <Display view={currView} />
        </div>
    )
}