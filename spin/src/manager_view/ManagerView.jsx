/**

ManagerView is a React component that serves as the main view for the manager interface.
It allows the user to select various tabs to view different reports and menus.
@module ManagerView
@requires React
@requires Button
@requires Display
@requires ./ManagerView.css
*/
import React, { useState } from 'react';
import Button from './Button';
import Display from './Display';
import './ManagerView.css';

export default function ManagerView(props) {
    /**
     * The main function that returns the ManagerView component.
     * @function ManagerView
     * @param {Object} props - The props object that contains the setMenuView function to change the view of the menu component.
     * @returns {JSX.Element} - The JSX code that renders the ManagerView component.
    */
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