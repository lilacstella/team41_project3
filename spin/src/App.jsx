import React, { useState } from 'react';
import Navbar from './Navbar';
import PurchaseView from './purchase-view/PurchaseView';
import ManagerView from './manager-view/ManagerView';
import './App.css';


export default function App() {
  const [showPurchaseView, setShowPurchaseView] = useState(true);
  
  const toggleView = () => {
    setShowPurchaseView(!showPurchaseView);
  };

  let displayText = "Spin N' Stone";
  let buttonText = "Login";

  if (!showPurchaseView) {
    displayText = "Manager View";
    buttonText = "Return";
  }

  return (
    <div className="App">
      <Navbar login={toggleView} displayText={displayText} buttonText={buttonText} />
      <div className="app-box">
        {showPurchaseView ? <PurchaseView /> : <ManagerView />}
      </div>
    </div>
  );
}