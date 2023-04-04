import React from 'react';
import Button from './Button';
import Display from './Display';
// import './ManagerView.css';

export default function ManagerView() {
    return (
        <div className="app-box">
            <div>
                <Button buttonText="Inventory"/>
            </div>
            
            <Display/>
        </div>
    )
} 