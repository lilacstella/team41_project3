import { useState } from 'react';
import Nav from './Nav';
import ManagerView from './manager_view/ManagerView';
import PurchaseView from './purchase_view/PurchaseView';
import Popup from './Popup';

function App() {
  const [showPurchaseView, setShowPurchaseView] = useState(true);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const toggleView = () => {
    setShowPurchaseView(!showPurchaseView);
    //setIsLoginPopupOpen(true);
    console.log(isLoginPopupOpen);
  };

  const toggleLoginPopup = () => {
    setIsLoginPopupOpen(!isLoginPopupOpen);
  }

  let displayText = "Spin N' Stone";
  let buttonText = "Login";

  if (!showPurchaseView) {
    displayText = "Manager View";
    buttonText = "Back";
  }

  return (
    <div>
      <Nav login={toggleView} displayText={displayText} buttonText={buttonText} />
      <div>
        {showPurchaseView ? <PurchaseView /> : <ManagerView />}
      </div>
      {isLoginPopupOpen ?
        <Popup isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} /> : null}
    </div>
  );
}

export default App;