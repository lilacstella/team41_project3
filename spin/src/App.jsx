import { useState } from 'react';
import Nav from './Nav';
import ManagerView from './manager_view/ManagerView';
import PurchaseView from './purchase_view/PurchaseView';
import MenuView from './menu_view/MenuView';
import ServerView from './server_view/ServerView';

function App() {
  const [showView, setView] = useState('customer');

  const views = {
    // should be login in customer direct 
    // react component, direct to, display text, button text
    'customer': [<PurchaseView setMenuView={() => setView('menu')} />, 'manager', "Spin N' Stone", 'Login'],
    'server': [<ServerView setMenuView={() => setView('menu')} />, 'server', "Server View", 'Back'],
    'manager': [<ManagerView setMenuView={() => setView('menu')} />, 'customer', 'Manager View', 'Back'],
    'menu': [<MenuView />, 'customer', "Spin N' Stone Menu", "Order"]
  };

  var [currView, direct, displayText, buttonText] = views[showView];

  return (
    <div>
      <Nav setView={setView} direct={direct} displayText={displayText} buttonText={buttonText} />
      <div>
        {currView}
      </div>
    </div>
  );
}

export default App;
