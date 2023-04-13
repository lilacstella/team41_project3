import React, { useState } from 'react';
import Button from './Button';
import Display from './Display';
import './ManagerView.css';

export default function ManagerView() {
    const [currView, setCurrView] = useState('display');

    return (
        <div className="manager-frame">
            <div className="manager-tabs-frame">
                {/* the buttonText lowered and hyphened is passed to setCurrView */}
                <Button className="manager-button" buttonText="Inventory" view={setCurrView}/>
                <Button className="manager-button disabled" buttonText="X Report" view={setCurrView}/>
                <Button className="manager-button" buttonText="Z Report" view={setCurrView}/>
                <Button className="manager-button disabled" buttonText="Prices" view={setCurrView}/>
                <Button className="manager-button disabled" buttonText="Sales Report" view={setCurrView}/>
                <Button className="manager-button disabled" buttonText="Excess Report" view={setCurrView}/>
                <Button className="manager-button disabled" buttonText="Restock Report" view={setCurrView}/>
                <Button className="manager-button disabled" buttonText="What Sells" view={setCurrView}/>
            </div>
            <Display view={currView}/>
        </div>
    )
}