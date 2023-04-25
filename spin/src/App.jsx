import { useState } from 'react';
import Nav from './Nav';
import ManagerView from './manager_view/ManagerView';
import PurchaseView from './purchase_view/PurchaseView';
import MenuView from './menu_view/MenuView';

function App() {
  const [showView, setView] = useState('menu');

  const views = {
      'customer': [<PurchaseView />, "Spin N' Stone", 'Login'],
      'manager': [<ManagerView />, 'Manager View', 'Back'],
      'menu': [<MenuView />, "Spin N' Stone Menu", "Order"]
  };

  var [currView, displayText, buttonText] = views[showView];

  return (
    <div>
      <Nav login={() => setView('customer')} displayText={displayText} buttonText={buttonText} />
      <div>
        {currView}
      </div>
    </div>
  );
}

export default App;
