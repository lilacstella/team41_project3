import {useState} from 'react';
import Nav from './Nav';
import ManagerView from './manager_view/ManagerView';

function App() {
  const [showPurchaseView, setShowPurchaseView] = useState(true);
  
  const toggleView = () => {
    setShowPurchaseView(!showPurchaseView);
  };

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
        {showPurchaseView ? <h1>hi</h1> : <ManagerView />}
      </div>
    </div>
  );
}

export default App;
